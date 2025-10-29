import { useState } from 'react'
import { MessageCircle, Share, MoreHorizontal, Send, FaHeart } from '../config/icons'
import { formatRelativeTime, truncateText } from '../utils/helpers'
import { addPoints, POINT_VALUES } from '../utils/badgeSystem'
import { useRealtimeComments } from '../hooks/useRealtimeComments'
import { circleService } from '../services/circleService'
import { useSupabaseAuth } from '../contexts/AuthContext'

function PostCard({ post, circleColor, onHeart, onShare }) {
  const { user } = useSupabaseAuth()
  const [isHearted, setIsHearted] = useState(post.isHearted)
  const [heartCount, setHeartCount] = useState(post.hearts)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [posting, setPosting] = useState(false)

  const { comments, loading: commentsLoading } = useRealtimeComments(showComments ? post.id : null)
  const shouldTruncate = post.content.length > 200

  const handleHeart = () => {
    const newHearted = !isHearted
    setIsHearted(newHearted)
    setHeartCount(prev => newHearted ? prev + 1 : prev - 1)
    onHeart?.(post.id, newHearted)
    
    if (newHearted) {
      addPoints(POINT_VALUES.heartReceived, 'Heart received')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/circle/${post.circleId}/post/${post.id}`)
    onShare?.()
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || posting) return

    setPosting(true)
    try {
      await circleService.createComment(user.id, post.id, newComment.trim(), false)
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="card p-4 mb-3" style={{ borderBottomColor: circleColor, borderBottomWidth: '2px' }}>
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
          {post.author.avatar}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-text-primary">{post.author.username}</p>
          <p className="text-xs text-text-secondary">Posted {post.timestamp}</p>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreHorizontal size={16} className="text-text-secondary" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-text-primary leading-relaxed font-readable">
          {shouldTruncate && !isExpanded 
            ? truncateText(post.content, 200)
            : post.content
          }
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-sm mt-1 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Read more'}
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
          className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
            isHearted 
              ? 'text-red-500 bg-red-50' 
              : 'text-text-secondary hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <FaHeart 
            size={20} 
            className={`transition-transform duration-200 ${isHearted ? 'scale-110' : ''}`}
            fill={isHearted ? 'currentColor' : 'none'}
          />
          <span className="text-sm">{heartCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="text-sm">{comments.length || post.commentCount || 0}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Share size={20} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {commentsLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3 mb-4">
              {comments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {comment.author.avatar}
                  </div>
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
                        <FaHeart size={12} />
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
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm flex-shrink-0">
              🐻
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm"
                maxLength={300}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || posting}
                className={`p-2 rounded-xl transition-colors ${
                  newComment.trim() && !posting
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={16} className={posting ? 'animate-pulse' : ''} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard