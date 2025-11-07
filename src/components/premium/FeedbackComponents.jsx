import { useState, useEffect } from 'react'
import { Sparkles, Star, X, CheckCircle } from '../../config/icons'
import { trackRetargetingInteraction } from '../../services/premiumAnalytics'

/**
 * ToastNotification - Non-intrusive toast for upgrade confirmations
 * Shows brief success messages with auto-dismiss
 */
export function ToastNotification({ message, type = 'success', onClose, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    info: <Star className="text-blue-500" size={20} />,
    premium: <Sparkles className="text-purple-500" size={20} />
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800',
    premium: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800'
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm
      animate-in slide-in-from-right-2 duration-300
      ${!isVisible ? 'animate-out slide-out-to-right-2 duration-300' : ''}
    `}>
      <div className={`${colors[type]} border rounded-lg p-4 shadow-lg`}>
        <div className="flex items-start gap-3">
          {icons[type]}
          <div className="flex-1 text-sm">
            {message}
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * CelebrationAnimation - Full-screen celebration overlay
 * Shows confetti and animations for major achievements
 */
export function CelebrationAnimation({ onComplete, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti container */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)],
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Central celebration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <div className="text-4xl font-bold text-white drop-shadow-lg animate-pulse">
            Premium Unlocked!
          </div>
          <div className="text-xl text-white/80 drop-shadow mt-2 animate-fade-in">
            Welcome to the next level
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * CelebrationBanner - Animated banner for post-upgrade success
 * Shows premium upgrade confirmation with animations
 */
export function CelebrationBanner({ onClose, autoClose = true, duration = 8000 }) {
  const [isVisible, setIsVisible] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Start confetti animation after mount
    const confettiTimer = setTimeout(() => setShowConfetti(true), 300)

    // Auto-close if enabled
    if (autoClose) {
      const closeTimer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Allow exit animation
      }, duration)
      return () => clearTimeout(closeTimer)
    }

    return () => clearTimeout(confettiTimer)
  }, [autoClose, duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`
      fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50
      animate-in slide-in-from-top-2 duration-500
      ${!isVisible ? 'animate-out slide-out-to-top-2 duration-300' : ''}
    `}>
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>

        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
          aria-label="Close celebration"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="text-yellow-300 animate-bounce" size={24} />
            <Sparkles className="text-yellow-300 animate-spin" size={20} />
          </div>

          <h3 className="text-xl font-bold mb-2">
            🎉 Welcome to Premium!
          </h3>

          <p className="text-white/90 text-sm mb-4">
            Your upgrade was successful! All premium features are now unlocked.
          </p>

          <div className="flex flex-wrap gap-2 justify-center text-xs">
            <span className="bg-white/20 px-2 py-1 rounded-full">Advanced Analytics</span>
            <span className="bg-white/20 px-2 py-1 rounded-full">Predictive Alerts</span>
            <span className="bg-white/20 px-2 py-1 rounded-full">Custom Themes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * PremiumHighlight - Highlights newly unlocked premium content
 * Adds a pulsing glow effect to draw attention
 */
export function PremiumHighlight({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-30 animate-pulse"></div>

      {/* Sparkle effects */}
      <div className="absolute -top-1 -right-1">
        <Sparkles className="w-4 h-4 text-purple-400 animate-ping" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

/**
 * RetargetingBanner - Subtle banner for free users
 * Shows premium benefits without being intrusive
 */
export function RetargetingBanner({ featureKey, onUpgrade, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true)

  // Track banner shown
  useEffect(() => {
    if (isVisible) {
      trackRetargetingInteraction(featureKey, 'shown', {
        bannerType: 'subtle_retargeting'
      })
    }
  }, [featureKey, isVisible])

  if (!isVisible) return null

  const messages = {
    'advanced-insights': 'Unlock detailed mood analytics and personalized insights',
    'predictive-alerts': 'Get AI-powered notifications about your mental wellness',
    'custom-themes': 'Personalize your app with beautiful custom themes',
    default: 'Upgrade to Premium for advanced features and insights'
  }

  const message = messages[featureKey] || messages.default

  const handleUpgrade = () => {
    trackRetargetingInteraction(featureKey, 'clicked', {
      bannerType: 'subtle_retargeting'
    })
    onUpgrade()
  }

  const handleDismiss = () => {
    trackRetargetingInteraction(featureKey, 'dismissed', {
      bannerType: 'subtle_retargeting'
    })
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <Star className="text-purple-500 mt-0.5 flex-shrink-0" size={20} />
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {message}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleUpgrade}
              className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition-colors"
            >
              Upgrade Now
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default { CelebrationBanner, PremiumHighlight, RetargetingBanner, ToastNotification, CelebrationAnimation }