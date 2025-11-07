import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Sparkles } from '../../config/icons'
import { RetargetingBanner } from './FeedbackComponents'
import { trackFeatureView, trackFeatureClick, trackUpgradeStart } from '../../services/premiumAnalytics'
import { isFeatureEnabled } from '../../config/premiumFeatures'

/**
 * PremiumGate - UI component that gates premium features
 * Shows blur overlay with lock icon and upgrade CTA for non-premium users
 * @param {Object} user - User object with isPremium flag
 * @param {string} featureKey - Key identifying the premium feature
 * @param {ReactNode} children - Content to gate
 * @param {string} className - Additional CSS classes
 * @param {boolean} showTooltip - Whether to show benefit tooltip on hover
 * @param {string} benefitText - Short benefit description for tooltip
 * @param {boolean} showRetargeting - Whether to show retargeting banner below
 */
export function PremiumGate({
  user,
  featureKey,
  children,
  className = '',
  showTooltip = true,
  benefitText = 'Unlock premium insights and advanced analytics',
  showRetargeting = false
}) {
  const navigate = useNavigate()
  const [showTooltipState, setShowTooltipState] = useState(false)
  const isPremium = !!user?.isPremium
  const featureEnabled = isFeatureEnabled(featureKey, user)

  // If feature is disabled by feature flags, don't show anything
  if (!featureEnabled && !isPremium) {
    return null
  }

  // If user is premium or feature is enabled, show content
  if (isPremium || featureEnabled) {
    return <>{children}</>
  }

  const handleUpgrade = () => {
    // Track upgrade initiation
    trackUpgradeStart(featureKey, 'premium_plan', {
      triggerLocation: 'premium_gate',
      benefitText
    })

    // Navigate to upgrade page with return context
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search)
    navigate(`/upgrade?returnTo=${returnTo}&triggerFeature=${featureKey}`)
  }

  // Track feature view when component mounts
  React.useEffect(() => {
    if (!isPremium) {
      trackFeatureView(featureKey, {
        gateType: 'blur_overlay',
        showRetargeting,
        benefitText
      })
    }
  }, [featureKey, isPremium, showRetargeting, benefitText])

  if (isPremium) {
    return <>{children}</>
  }

  return (
    <div className={className}>
      {/* Gated content */}
      <div className="relative">
        {/* Blurred content */}
        <div className="filter blur-sm pointer-events-none select-none opacity-60">
          {children}
        </div>

        {/* Premium overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 flex flex-col items-center gap-4 max-w-xs mx-4"
            onMouseEnter={() => showTooltip && setShowTooltipState(true)}
            onMouseLeave={() => setShowTooltipState(false)}
          >
            {/* Lock icon with sparkle */}
            <div className="relative">
              <Lock className="w-8 h-8 text-primary" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>

            {/* Feature title */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Premium Feature
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {benefitText}
              </p>
            </div>

            {/* Upgrade button */}
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Tooltip (shown on hover for desktop) */}
        {showTooltip && showTooltipState && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
            {benefitText}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Retargeting banner */}
      {showRetargeting && (
        <RetargetingBanner
          featureKey={featureKey}
          onUpgrade={handleUpgrade}
          onDismiss={() => {}}
        />
      )}
    </div>
  )
}

export default PremiumGate