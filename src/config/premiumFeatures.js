/**
 * Premium Features Registry
 * Centralized configuration for all premium features in the app
 * Used by UI components to conditionally render features and by backend for access control
 */

import { featureFlags } from '../services/featureFlags'

export const PREMIUM_FEATURES = [
  {
    key: 'advanced-insights',
    title: 'Advanced Insights',
    description: 'Deep analysis of your mood patterns and trends',
    premium: true,
    category: 'analytics',
    icon: 'BarChart3',
    benefitText: 'Unlock detailed mood analytics and personalized insights'
  },
  {
    key: 'predictive-alerts',
    title: 'Predictive Alerts',
    description: 'AI-powered alerts for potential mood changes',
    premium: true,
    category: 'analytics',
    icon: 'AlertTriangle',
    benefitText: 'Get proactive notifications about your mental wellness'
  },
  {
    key: 'custom-themes',
    title: 'Custom Themes',
    description: 'Personalize your app with custom color schemes',
    premium: true,
    category: 'personalization',
    icon: 'Palette',
    benefitText: 'Create your perfect visual environment'
  },
  {
    key: 'private-groups',
    title: 'Private Groups',
    description: 'Create exclusive support communities',
    premium: true,
    category: 'social',
    icon: 'Users',
    benefitText: 'Build meaningful connections in private spaces'
  },
  {
    key: 'streak-insurance',
    title: 'Streak Insurance',
    description: 'Protect your habit streaks from interruptions',
    premium: true,
    category: 'gamification',
    icon: 'Shield',
    benefitText: 'Never lose your progress again'
  },
  {
    key: 'wellness-breakdown',
    title: 'Wellness Breakdown',
    description: 'Comprehensive wellness metrics and reports',
    premium: true,
    category: 'analytics',
    icon: 'PieChart',
    benefitText: 'Understand your complete wellness picture'
  },
  // Free features
  {
    key: 'basic-mood-tracking',
    title: 'Basic Mood Tracking',
    description: 'Log your daily moods and emotions',
    premium: false,
    category: 'core',
    icon: 'Heart',
    benefitText: 'Start your wellness journey'
  },
  {
    key: 'community-support',
    title: 'Community Support',
    description: 'Connect with others in public circles',
    premium: false,
    category: 'social',
    icon: 'Users',
    benefitText: 'Find support in our community'
  }
]

/**
 * Get features by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered features
 */
export function getFeaturesByCategory(category) {
  return PREMIUM_FEATURES.filter(feature => feature.category === category)
}

/**
 * Get premium features only
 * @returns {Array} Premium features
 */
export function getPremiumFeatures() {
  return PREMIUM_FEATURES.filter(feature => feature.premium)
}

/**
 * Get free features only
 * @returns {Array} Free features
 */
export function getFreeFeatures() {
  return PREMIUM_FEATURES.filter(feature => !feature.premium)
}

/**
 * Check if a feature is premium
 * @param {string} featureKey - Feature key to check
 * @returns {boolean} Whether the feature is premium
 */
export function isPremiumFeature(featureKey) {
  const feature = PREMIUM_FEATURES.find(f => f.key === featureKey)
  return feature?.premium || false
}

/**
 * Get feature by key
 * @param {string} featureKey - Feature key
 * @returns {Object|null} Feature object or null if not found
 */
export function getFeature(featureKey) {
  return PREMIUM_FEATURES.find(f => f.key === featureKey) || null
}

/**
 * Check if a feature is enabled for the current user
 * Takes into account premium status, feature flags, and backend state
 * @param {string} featureKey - Feature key to check
 * @param {Object} user - User object with isPremium flag
 * @returns {boolean} Whether the feature is enabled
 */
export function isFeatureEnabled(featureKey, user = null) {
  const feature = getFeature(featureKey)
  if (!feature) return false

  // Check feature flag first
  if (!featureFlags.isEnabled(featureKey)) {
    return false
  }

  // If feature is not premium, it's always enabled
  if (!feature.premium) return true

  // Check user premium status
  if (!user?.isPremium) return false

  // In production, check backend entitlement
  // return checkBackendEntitlement(featureKey, user.id)

  return true
}

/**
 * Get features available to a user
 * @param {Object} user - User object
 * @param {string} category - Optional category filter
 * @returns {Array} Available features
 */
export function getAvailableFeatures(user = null, category = null) {
  let features = PREMIUM_FEATURES

  if (category) {
    features = features.filter(f => f.category === category)
  }

  return features.filter(feature => isFeatureEnabled(feature.key, user))
}

/**
 * Sync features with backend
 * In production, this would fetch the latest feature configuration
 */
export async function syncFeaturesWithBackend() {
  try {
    // In production:
    // const response = await fetch('/api/features')
    // const backendFeatures = await response.json()
    // Merge with local features...

    console.log('Syncing features with backend...')

    // Refresh feature flags
    await featureFlags.refresh()

  } catch (error) {
    console.error('Failed to sync features with backend:', error)
  }
}

/**
 * Check backend entitlement (mock implementation)
 * @param {string} featureKey - Feature key
 * @param {string} userId - User ID
 * @returns {boolean} Whether user has entitlement
 */
function checkBackendEntitlement(featureKey, userId) {
  // In production, this would call your backend API
  // For now, simulate based on local storage
  try {
    const entitlements = JSON.parse(localStorage.getItem('space4u_entitlements') || '{}')
    return entitlements[featureKey] || false
  } catch (error) {
    console.warn('Failed to check backend entitlement:', error)
    return false
  }
}

/**
 * Update user entitlements (called after successful payment)
 * @param {string} userId - User ID
 * @param {Array} featureKeys - Features to enable
 */
export function updateEntitlements(userId, featureKeys) {
  try {
    const entitlements = JSON.parse(localStorage.getItem('space4u_entitlements') || '{}')

    featureKeys.forEach(key => {
      entitlements[key] = true
    })

    localStorage.setItem('space4u_entitlements', JSON.stringify(entitlements))

    // In production, sync with backend
    // await fetch('/api/entitlements', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, entitlements })
    // })

  } catch (error) {
    console.error('Failed to update entitlements:', error)
  }
}

/**
 * Get feature rollout status
 * @param {string} featureKey - Feature key
 * @returns {Object} Rollout information
 */
export function getFeatureRolloutStatus(featureKey) {
  const flagValue = featureFlags.getValue(featureKey)

  return {
    enabled: featureFlags.isEnabled(featureKey),
    rolloutPercentage: typeof flagValue === 'number' ? flagValue * 100 : null,
    variant: typeof flagValue === 'string' && flagValue.startsWith('variant_') ? flagValue : null,
    fullyRolledOut: flagValue === true
  }
}