/**
 * Feature Flags Service
 * Manages feature flags and A/B testing for premium features
 * Integrates with backend for dynamic feature control
 */

class FeatureFlagsService {
  constructor() {
    this.flags = {}
    this.userOverrides = {}
    this.initialized = false
  }

  /**
   * Initialize feature flags from backend or local storage
   */
  async initialize() {
    if (this.initialized) return

    try {
      // Load from localStorage first (for offline support)
      const stored = localStorage.getItem('space4u_feature_flags')
      if (stored) {
        this.flags = JSON.parse(stored)
      }

      // In production, fetch from backend
      // const response = await fetch('/api/feature-flags')
      // this.flags = await response.json()

      // For demo, use mock feature flags
      this.flags = {
        'premium_gates': true,
        'retargeting_banners': true,
        'celebration_animations': true,
        'analytics_tracking': true,
        'advanced_analytics': true,
        'predictive_alerts': false, // Disabled for demo
        'custom_themes': true,
        'private_groups': true,
        'streak_insurance': true,
        'ab_test_upgrade_flow': 'variant_a', // A/B test variant
        'new_feature_rollout': 0.5 // 50% rollout
      }

      this.initialized = true
      this.saveToStorage()

    } catch (error) {
      console.error('Failed to initialize feature flags:', error)
      // Fallback to all features enabled
      this.flags = {}
    }
  }

  /**
   * Check if a feature flag is enabled
   * @param {string} flagKey - Feature flag key
   * @param {Object} context - Context for percentage rollouts or A/B tests
   * @returns {boolean} Whether the feature is enabled
   */
  isEnabled(flagKey, context = {}) {
    // Check user override first
    if (this.userOverrides[flagKey] !== undefined) {
      return this.userOverrides[flagKey]
    }

    const flagValue = this.flags[flagKey]

    if (flagValue === undefined) {
      return false // Default to disabled for unknown flags
    }

    // Handle percentage rollouts
    if (typeof flagValue === 'number' && flagValue < 1) {
      const userId = context.userId || this.getUserId()
      const hash = this.simpleHash(userId + flagKey)
      return (hash % 100) / 100 < flagValue
    }

    // Handle A/B test variants
    if (typeof flagValue === 'string' && flagValue.startsWith('variant_')) {
      return flagValue === context.variant
    }

    return Boolean(flagValue)
  }

  /**
   * Get feature flag value
   * @param {string} flagKey - Feature flag key
   * @returns {*} Feature flag value
   */
  getValue(flagKey) {
    return this.flags[flagKey]
  }

  /**
   * Override feature flag for current user (for testing)
   * @param {string} flagKey - Feature flag key
   * @param {*} value - Override value
   */
  setOverride(flagKey, value) {
    this.userOverrides[flagKey] = value
  }

  /**
   * Clear user override
   * @param {string} flagKey - Feature flag key
   */
  clearOverride(flagKey) {
    delete this.userOverrides[flagKey]
  }

  /**
   * Get all active feature flags
   * @returns {Object} All feature flags
   */
  getAllFlags() {
    return { ...this.flags, ...this.userOverrides }
  }

  /**
   * Refresh feature flags from backend
   */
  async refresh() {
    try {
      // In production: fetch from backend
      // const response = await fetch('/api/feature-flags')
      // const newFlags = await response.json()

      // For demo, simulate refresh
      console.log('Refreshing feature flags...')
      this.initialized = false
      await this.initialize()

    } catch (error) {
      console.error('Failed to refresh feature flags:', error)
    }
  }

  /**
   * Simple hash function for percentage rollouts
   * @param {string} str - String to hash
   * @returns {number} Hash value
   */
  simpleHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Get current user ID for rollouts
   * @returns {string} User ID
   */
  getUserId() {
    return localStorage.getItem('space4u_user_id') || 'anonymous'
  }

  /**
   * Save flags to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('space4u_feature_flags', JSON.stringify(this.flags))
    } catch (error) {
      console.warn('Failed to save feature flags to storage:', error)
    }
  }

  /**
   * Track feature flag usage for analytics
   * @param {string} flagKey - Feature flag key
   * @param {boolean} enabled - Whether the feature was enabled
   */
  trackUsage(flagKey, enabled) {
    // In production, send to analytics
    console.log(`Feature flag ${flagKey}: ${enabled ? 'enabled' : 'disabled'}`)
  }
}

// Create singleton instance
export const featureFlags = new FeatureFlagsService()

// Convenience functions
export const isFeatureEnabled = (flagKey, context) => featureFlags.isEnabled(flagKey, context)
export const getFeatureValue = (flagKey) => featureFlags.getValue(flagKey)
export const setFeatureOverride = (flagKey, value) => featureFlags.setOverride(flagKey, value)

export default featureFlags