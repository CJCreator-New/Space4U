import { Lock, Share } from 'lucide-react'

function BadgeCard({ badge, badgeData, onClick, onShare }) {
  const isUnlocked = badgeData?.unlocked || false
  const progress = badgeData?.progress || 0
  const requirement = badgeData?.requirement || badge.requirement
  const progressPercent = (progress / requirement) * 100

  const handleShare = (e) => {
    e.stopPropagation()
    onShare?.(badge)
  }

  return (
    <div
      onClick={() => onClick?.(badge)}
      className={`card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        isUnlocked ? '' : 'opacity-50'
      }`}
      style={{
        filter: isUnlocked ? 'none' : 'grayscale(100%)'
      }}
    >
      <div className="text-center">
        {/* Badge Icon */}
        <div className="relative mb-3">
          <div className="text-4xl mb-2">{badge.emoji}</div>
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-800/80 rounded-full p-1">
                <Lock size={16} className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Badge Info */}
        <h3 className="font-bold text-text-primary mb-1">{badge.name}</h3>
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
          {badge.description}
        </p>

        {/* Progress or Unlock Date */}
        {isUnlocked ? (
          <div className="space-y-2">
            <div className="text-xs text-success font-medium">
              Unlocked {new Date(badgeData.unlockedAt).toLocaleDateString()}
            </div>
            <div className="text-xs text-primary font-medium">
              +{badge.points} points
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 mx-auto px-2 py-1 text-xs text-text-secondary hover:text-primary transition-colors"
            >
              <Share size={12} />
              Share
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {progress > 0 && (
              <>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-text-secondary">
                  {progress}/{requirement} {badge.category === 'consistency' ? 'days' : 'completed'}
                </div>
              </>
            )}
            <div className="text-xs text-text-secondary">
              {badge.points} points when unlocked
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BadgeCard