import { useState } from 'react'
import { REACTIONS, toggleReaction, getPostReactions, getUserReaction } from '../utils/reactions'

function ReactionPicker({ postId, onReact }) {
  const [showPicker, setShowPicker] = useState(false)
  const userId = JSON.parse(localStorage.getItem('safespace_user') || '{}').username || 'anonymous'
  const reactions = getPostReactions(postId)
  const userReaction = getUserReaction(postId, userId)

  const handleReact = (type) => {
    toggleReaction(postId, type, userId)
    setShowPicker(false)
    onReact?.()
  }

  const getTotalCount = () => {
    return Object.values(reactions).reduce((sum, users) => sum + users.length, 0)
  }

  return (
    <div className="relative">
      {/* Reaction Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
          userReaction 
            ? 'bg-primary/10 text-primary' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
      >
        <span className="text-lg">{userReaction ? REACTIONS[userReaction].emoji : '👍'}</span>
        {getTotalCount() > 0 && (
          <span className="text-sm font-medium">{getTotalCount()}</span>
        )}
      </button>

      {/* Reaction Picker */}
      {showPicker && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-2 flex gap-1 z-20">
            {Object.entries(REACTIONS).map(([type, { emoji, label }]) => (
              <button
                key={type}
                onClick={() => handleReact(type)}
                className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={label}
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Reaction Summary */}
      {getTotalCount() > 0 && (
        <div className="flex gap-1 mt-2">
          {Object.entries(reactions).map(([type, users]) => (
            users.length > 0 && (
              <div
                key={type}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                title={`${users.length} ${REACTIONS[type].label}`}
              >
                <span>{REACTIONS[type].emoji}</span>
                <span className="text-gray-600 dark:text-gray-400">{users.length}</span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default ReactionPicker
