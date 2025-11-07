import { useState, useRef, useEffect } from 'react'
import { Image, Smile, Tag, AlertTriangle, Send, X } from 'lucide-react'

const commonTags = ['advice-needed', 'venting', 'success-story', 'question', 'support', 'resources']

function FacebookStylePostComposer({ circle, onPostCreated }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [hasTriggerWarning, setHasTriggerWarning] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const textareaRef = useRef(null)
  const localUser = JSON.parse(localStorage.getItem('space4u_user') || '{}')

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isExpanded])

  const handlePost = async () => {
    if (!content.trim() || content.length > 500 || isPosting) return

    setIsPosting(true)

    // Simulate post creation
    const newPost = {
      id: Date.now(),
      circleId: circle.id,
      author: localUser.username || 'Anonymous',
      avatar: localUser.avatar || '🐻',
      content: content.trim(),
      tags,
      hasTriggerWarning,
      timestamp: new Date().toISOString(),
      hearts: 0,
      commentCount: 0,
      isAnonymous: false
    }

    // Save to localStorage
    const posts = JSON.parse(localStorage.getItem('space4u_posts') || '[]')
    posts.unshift(newPost)
    localStorage.setItem('space4u_posts', JSON.stringify(posts))

    setTimeout(() => {
      setIsPosting(false)
      onPostCreated?.(newPost)
      resetForm()
    }, 800)
  }

  const resetForm = () => {
    setContent('')
    setTags([])
    setShowTagSelector(false)
    setHasTriggerWarning(false)
    setIsExpanded(false)
  }

  const addTag = (tag) => {
    if (tags.length < 3 && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setShowTagSelector(false)
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const getCharacterColor = () => {
    if (content.length <= 400) return 'text-gray-500'
    if (content.length <= 475) return 'text-warning'
    return 'text-danger'
  }

  const canPost = content.trim() && content.length <= 500 && !isPosting

  return (
    <div className="card mb-4">
      {/* Collapsed State - Facebook-style "What's on your mind?" */}
      {!isExpanded ? (
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg flex-shrink-0">
              {localUser.avatar || '🐻'}
            </div>
            <button
              onClick={() => setIsExpanded(true)}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-left text-text-secondary transition-colors"
            >
              What's on your mind, {localUser.username || 'friend'}?
            </button>
          </div>
          <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary"
            >
              <Tag size={20} className="text-primary" />
              <span className="text-sm font-medium">Tag</span>
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary"
            >
              <Smile size={20} className="text-green-500" />
              <span className="text-sm font-medium">Feeling</span>
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary"
            >
              <AlertTriangle size={20} className="text-warning" />
              <span className="text-sm font-medium">Warning</span>
            </button>
          </div>
        </div>
      ) : (
        /* Expanded State - Full Composer */
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                {localUser.avatar || '🐻'}
              </div>
              <div>
                <p className="font-medium text-text-primary">{localUser.username || 'Anonymous'}</p>
                <p className="text-xs text-text-secondary">Posting to {circle.name}</p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? This is a safe space..."
            className="w-full min-h-[120px] p-3 border border-gray-200 rounded-xl focus:border-primary outline-none resize-none text-text-primary placeholder-text-secondary"
            style={{ fontSize: '15px' }}
          />

          {/* Character Count */}
          <div className="flex justify-end mt-1">
            <span className={`text-xs font-medium ${getCharacterColor()}`}>
              {content.length}/500
            </span>
          </div>

          {/* Selected Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: circle?.color || '#6366F1' }}
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag Selector */}
          {showTagSelector && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-text-primary mb-2">Add tags (max 3)</p>
              <div className="flex flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    disabled={tags.length >= 3 || tags.includes(tag)}
                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trigger Warning Badge */}
          {hasTriggerWarning && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertTriangle size={16} className="text-warning" />
              <span className="text-sm text-warning font-medium">Contains sensitive content</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTagSelector(!showTagSelector)}
                className={`p-2 rounded-lg transition-colors ${
                  showTagSelector ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-text-secondary'
                }`}
                title="Add tags"
              >
                <Tag size={20} />
              </button>
              <button
                onClick={() => setHasTriggerWarning(!hasTriggerWarning)}
                className={`p-2 rounded-lg transition-colors ${
                  hasTriggerWarning ? 'bg-warning/10 text-warning' : 'hover:bg-gray-100 text-text-secondary'
                }`}
                title="Add trigger warning"
              >
                <AlertTriangle size={20} />
              </button>
            </div>

            <button
              onClick={handlePost}
              disabled={!canPost}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                canPost
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacebookStylePostComposer
