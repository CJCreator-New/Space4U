import { useState, memo, useCallback, useReducer } from 'react'
import Icon from './Icon'
import OptimizedAvatar from './OptimizedAvatar'
import { formatRelativeTime, truncateText } from '../utils/helpers'
import { addPoints, POINT_VALUES } from '../utils/badgeSystem'
import { useRealtimeComments } from '../hooks/useRealtimeComments'
import { circleService } from '../services/circleService'
import { useSupabaseAuth } from '../contexts/AuthContext'
import { useDebounce } from '../hooks/useDebounce'

const initialPostState = {
  isHearted: false,
  heartCount: 0,
  showComments: false,
  newComment: '',
  isExpanded: false,
  posting: false
}

const postReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_STATE':
      return {
        ...state,
        isHearted: action.payload.isHearted,
        heartCount: action.payload.hearts
      }
    case 'TOGGLE_HEART':
      const newHearted = !state.isHearted
      return {
        ...state,
        isHearted: newHearted,
        heartCount: newHearted ? state.heartCount + 1 : state.heartCount - 1
      }
    case 'TOGGLE_COMMENTS':
      return { ...state, showComments: !state.showComments }
    case 'SET_NEW_COMMENT':
      return { ...state, newComment: action.payload }
    case 'TOGGLE_EXPANDED':
      return { ...state, isExpanded: !state.isExpanded }
    case 'SET_POSTING':
      return { ...state, posting: action.payload }
    case 'RESET_COMMENT':
      return { ...state, newComment: '', posting: false }
    default:
      return state
  }
}

const PostCard = memo(function PostCard({ post, circleColor, onHeart, onShare }) {
  const { user } = useSupabaseAuth()
  const [postState, dispatch] = useReducer(postReducer, {
    ...initialPostState,
    isHearted: post.isHearted,
    heartCount: post.hearts
  })

  const { comments, loading: commentsLoading } = useRealtimeComments(postState.showComments ? post.id : null)
  const shouldTruncate = post.content.length > 200

  // Debounce comment input
  const debouncedComment = useDebounce(postState.newComment, 300)

  const handleHeart = useCallback(() => {
    dispatch({ type: 'TOGGLE_HEART' })
    onHeart?.(post.id, !postState.isHearted)
    
    if (!postState.isHearted) {
      addPoints(POINT_VALUES.heartReceived, 'Heart received')
    }
  }, [postState.isHearted, onHeart, post.id])

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/circle/${post.circleId}/post/${post.id}`)
    onShare?.()
  }, [post.circleId, post.id, onShare])

  const handleAddComment = useCallback(async () => {
    if (!postState.newComment.trim() || !user || postState.posting) return

    dispatch({ type: 'SET_POSTING', payload: true })
    try {
      await circleService.createComment(user.id, post.id, postState.newComment.trim(), false)
      dispatch({ type: 'RESET_COMMENT' })
    } catch (error) {
      console.error('Failed to add comment:', error)
      dispatch({ type: 'SET_POSTING', payload: false })
    }
  }, [debouncedComment, user, postState.posting, postState.newComment, post.id])

  return (
    <div className="card p-4 mb-3" style={{ borderBottomColor: circleColor, borderBottomWidth: '2px' }}>
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-3">
        <OptimizedAvatar
          src={post.author.avatarUrl}
          fallback={post.author.avatar}
          alt={`${post.author.username}'s avatar`}
          size={40}
        />
        <div className="flex-1">
          <p className="font-semibold text-sm text-text-primary">{post.author.username}</p>
          <p className="text-xs text-text-secondary">Posted {post.timestamp}</p>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <Icon name="more-horizontal" size={16} className="text-text-secondary" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-text-primary leading-relaxed font-readable">
          {shouldTruncate && !postState.isExpanded 
            ? truncateText(post.content, 200)
            : post.content
          }
        </p>
        {shouldTruncate && (
          <button
            onClick={() => dispatch({ type: 'TOGGLE_EXPANDED' })}
            className="text-primary text-sm mt-1 hover:underline"
          >
            {postState.isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Interaction Bar */}
      <div className="flex items-center gap-4 py-2 border-t border-gray-100">
        <button
          onClick={handleHeart}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
            postState.isHearted 
              ? 'text-red-500 bg-red-50' 
              : 'text-text-secondary hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Icon 
            name="heart" 
            size={20} 
            className={`transition-transform duration-200 ${postState.isHearted ? 'scale-110' : ''}`}
          />
          <span className="text-sm">{postState.heartCount}</span>
        </button>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_COMMENTS' })}
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Icon name="message-circle" size={20} />
          <span className="text-sm">{comments.length || post.commentCount || 0}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Icon name="share" size={20} />
        </button>
      </div>

      {/* Comments Section */}
      {postState.showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {commentsLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3 mb-4">
              {comments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <OptimizedAvatar
                    src={comment.profiles?.avatar_url}
                    fallback={comment.author.avatar}
                    alt={`${comment.profiles?.username || 'Anonymous'}'s avatar`}
                    size={32}
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="font-medium text-sm text-text-primary mb-1">
                        {comment.profiles?.username || 'Anonymous'}
                      </p>
                      <p className="text-sm text-text-primary">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 ml-3">
                      <span className="text-xs text-text-secondary">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                      <button className="text-xs text-text-secondary hover:text-primary">
                        Reply
                      </button>
                      <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-red-500">
                        <Icon name="heart" size={12} />
                        {comment.hearts}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length > 5 && (
                <button className="text-sm text-primary hover:underline">
                  Load more comments
                </button>
              )}
            </div>
          ) : (
            <p className="text-text-secondary text-sm mb-4">No comments yet. Be the first!</p>
          )}

          {/* Add Comment */}
          <div className="flex gap-3">
            <OptimizedAvatar
              src={user?.avatar_url}
              fallback="🐻"
              alt="Your avatar"
              size={32}
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={postState.newComment}
                onChange={(e) => dispatch({ type: 'SET_NEW_COMMENT', payload: e.target.value })}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm"
                maxLength={300}
              />
              <button
                onClick={handleAddComment}
                disabled={!postState.newComment.trim() || postState.posting}
                className={`p-2 rounded-xl transition-colors ${
                  postState.newComment.trim() && !postState.posting
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Icon name="send" size={16} className={postState.posting ? 'animate-pulse' : ''} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for optimal re-rendering
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.hearts === nextProps.post.hearts &&
    prevProps.post.commentCount === nextProps.post.commentCount &&
    prevProps.circleColor === nextProps.circleColor
  )
})

export default PostCard