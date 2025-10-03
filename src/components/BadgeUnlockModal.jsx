import { useState, useEffect } from 'react'
import { X, Share } from 'lucide-react'

function BadgeUnlockModal({ badge, isOpen, onClose, onShare }) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen || !badge) return null

  const handleShare = () => {
    onShare?.(badge)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🌟', '🎊'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">{badge.emoji}</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Achievement Unlocked!
          </h2>
          <h3 className="text-xl font-semibold text-primary mb-2">
            {badge.name}
          </h3>
          <p className="text-text-secondary mb-4">
            {badge.description}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full font-medium">
            <span>+{badge.points} points earned!</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors"
          >
            <Share size={16} />
            Share
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default BadgeUnlockModal