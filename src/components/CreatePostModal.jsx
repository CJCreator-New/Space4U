import { useState, useEffect, useRef } from 'react'
import { X, Tag, AlertTriangle, FileText, Check, Loader } from 'lucide-react'
import { circleService } from '../services/circleService'
import { useSupabaseAuth } from '../contexts/AuthContext'

const commonTags = [
  'advice-needed', 'venting', 'success-story', 'question', 'support', 'resources'
]

const triggerWarnings = [
  'Self-harm', 'Eating disorders', 'Substance abuse', 'Suicide ideation', 
  'Domestic violence', 'Sexual assault', 'Death/grief', 'Medical procedures'
]

function CreatePostModal({ isOpen, onClose, circle, onPostCreated }) {
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [customTag, setCustomTag] = useState('')
  const [hasTriggerWarning, setHasTriggerWarning] = useState(false)
  const [triggerWarning, setTriggerWarning] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)
  const [drafts, setDrafts] = useState([])
  const [error, setError] = useState('')

  const textareaRef = useRef(null)
  const { user } = useSupabaseAuth()
  const localUser = JSON.parse(localStorage.getItem('safespace_user_profile') || '{}')

  useEffect(() => {
    if (isOpen) {
      loadDrafts()
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handlePost()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, content])

  const loadDrafts = () => {
    const savedDrafts = JSON.parse(localStorage.getItem('safespace_drafts') || '[]')
    const circleDrafts = savedDrafts.filter(draft => draft.circleId === circle?.id)
    setDrafts(circleDrafts)
  }

  const saveDraft = () => {
    if (!content.trim()) return

    const draft = {
      id: Date.now(),
      circleId: circle.id,
      circleName: circle.name,
      content,
      tags,
      hasTriggerWarning,
      triggerWarning,
      timestamp: new Date().toISOString()
    }

    const savedDrafts = JSON.parse(localStorage.getItem('safespace_drafts') || '[]')
    const updatedDrafts = [...savedDrafts, draft]
    localStorage.setItem('safespace_drafts', JSON.stringify(updatedDrafts))
    
    resetForm()
    onClose()
  }

  const loadDraft = (draft) => {
    setContent(draft.content)
    setTags(draft.tags || [])
    setHasTriggerWarning(draft.hasTriggerWarning || false)
    setTriggerWarning(draft.triggerWarning || '')
    setShowDrafts(false)
    
    // Remove draft from storage
    const savedDrafts = JSON.parse(localStorage.getItem('safespace_drafts') || '[]')
    const updatedDrafts = savedDrafts.filter(d => d.id !== draft.id)
    localStorage.setItem('safespace_drafts', JSON.stringify(updatedDrafts))
    loadDrafts()
  }

  const deleteDraft = (draftId) => {
    const savedDrafts = JSON.parse(localStorage.getItem('safespace_drafts') || '[]')
    const updatedDrafts = savedDrafts.filter(d => d.id !== draftId)
    localStorage.setItem('safespace_drafts', JSON.stringify(updatedDrafts))
    loadDrafts()
  }

  const handleClose = () => {
    if (content.trim()) {
      if (window.confirm('Discard draft? Your post will be lost.')) {
        resetForm()
        onClose()
      }
    } else {
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setContent('')
    setTags([])
    setShowTagSelector(false)
    setCustomTag('')
    setHasTriggerWarning(false)
    setTriggerWarning('')
    setError('')
    setShowSuccess(false)
    setShowDrafts(false)
  }

  const addTag = (tag) => {
    if (tags.length < 3 && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setCustomTag('')
    setShowTagSelector(false)
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handlePost = async () => {
    if (!content.trim() || content.length > 500 || isPosting || !user) return

    setIsPosting(true)
    setError('')

    try {
      const { data, error } = await circleService.createPost(
        user.id,
        circle.id,
        content.trim(),
        false
      )

      if (error) throw error

      setShowSuccess(true)
      
      setTimeout(() => {
        resetForm()
        onClose()
        onPostCreated?.(data?.[0])
      }, 1500)

    } catch (err) {
      setError('Failed to post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  const getCharacterColor = () => {
    if (content.length <= 400) return 'text-success'
    if (content.length <= 475) return 'text-warning'
    return 'text-danger'
  }

  const canPost = content.trim() && content.length <= 500 && !isPosting

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-surface w-full md:max-w-2xl md:mx-4 rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-hidden animate-slide-up">
        {showSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-success" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Posted!</h3>
            <p className="text-text-secondary">Your voice matters ❤️</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-text-primary">
                  Share with {circle?.name}
                </h2>
                {drafts.length > 0 && (
                  <button
                    onClick={() => setShowDrafts(!showDrafts)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-text-secondary hover:bg-gray-200 transition-colors"
                  >
                    <FileText size={14} />
                    Drafts ({drafts.length})
                  </button>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="px-5 md:px-8 py-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                  {localUser.avatar || '🐻'}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{localUser.username || 'Anonymous'}</p>
                  <p className="text-sm text-text-secondary">Posting to circle</p>
                </div>
              </div>
            </div>

            {/* Drafts Selector */}
            {showDrafts && (
              <div className="px-5 md:px-8 py-4 border-b border-gray-100">
                <h4 className="font-medium text-text-primary mb-3">Your Drafts</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {drafts.map((draft) => (
                    <div key={draft.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1 cursor-pointer" onClick={() => loadDraft(draft)}>
                        <p className="text-sm text-text-primary line-clamp-1">{draft.content}</p>
                        <p className="text-xs text-text-secondary">
                          {new Date(draft.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-1 text-text-secondary hover:text-danger transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-5 md:p-8 flex-1 overflow-y-auto">
              {/* Textarea */}
              <div className="mb-4">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? This is a safe space..."
                  className="w-full min-h-[150px] max-h-[400px] p-0 border-none outline-none resize-none text-text-primary placeholder-text-secondary leading-relaxed"
                  style={{ fontSize: '16px' }}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowTagSelector(!showTagSelector)}
                      className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    >
                      <Tag size={16} />
                      Add tags
                    </button>
                    <button
                      onClick={() => setHasTriggerWarning(!hasTriggerWarning)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                        hasTriggerWarning
                          ? 'text-warning bg-warning/10'
                          : 'text-text-secondary hover:text-warning hover:bg-warning/10'
                      }`}
                    >
                      <AlertTriangle size={16} />
                      Trigger warning
                    </button>
                  </div>
                  <span className={`text-sm font-medium ${getCharacterColor()}`}>
                    {content.length}/500
                  </span>
                </div>
              </div>

              {/* Tag Selector */}
              {showTagSelector && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-text-primary mb-3">Add tags (max 3)</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Custom tag..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && customTag.trim() && addTag(customTag.trim())}
                    />
                    <button
                      onClick={() => customTag.trim() && addTag(customTag.trim())}
                      disabled={!customTag.trim() || tags.length >= 3}
                      className="px-4 py-2 bg-primary text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Trigger Warning Selector */}
              {hasTriggerWarning && (
                <div className="mb-4 p-4 bg-warning/5 border border-warning/20 rounded-xl">
                  <h4 className="font-medium text-text-primary mb-3">Trigger Warning</h4>
                  <select
                    value={triggerWarning}
                    onChange={(e) => setTriggerWarning(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none"
                  >
                    <option value="">Select topic...</option>
                    {triggerWarnings.map((tw) => (
                      <option key={tw} value={tw}>{tw}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white"
                        style={{ backgroundColor: circle?.color }}
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
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 md:p-8 border-t border-gray-100">
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <button
                  onClick={handlePost}
                  disabled={!canPost}
                  className={`flex-1 md:flex-none md:px-8 py-3 rounded-xl font-semibold transition-all ${
                    canPost
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPosting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin" size={16} />
                      Posting...
                    </div>
                  ) : (
                    'Post'
                  )}
                </button>
                <button
                  onClick={saveDraft}
                  disabled={!content.trim()}
                  className="px-6 py-3 border border-gray-200 text-text-secondary rounded-xl hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save as draft
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-text-secondary text-center">
                Remember: Be kind, supportive, and respectful •{' '}
                <button className="text-primary hover:underline">Community Guidelines</button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CreatePostModal