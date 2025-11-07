/**
 * Analytics Service for Premium Features
 * Tracks user interactions with premium features for insights and optimization
 */

class PremiumAnalytics {
  constructor() {
    this.events = []
    this.sessionId = this.generateSessionId()
    this.userId = this.getUserId()
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get or create user ID
   */
  getUserId() {
    let userId = localStorage.getItem('space4u_user_id')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('space4u_user_id', userId)
    }
    return userId
  }

  /**
   * Track premium feature interaction
   * @param {string} eventType - Type of event (view, click, upgrade, etc.)
   * @param {string} featureKey - Premium feature key
   * @param {Object} metadata - Additional event data
   */
  trackEvent(eventType, featureKey, metadata = {}) {
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      eventType,
      featureKey,
      userAgent: navigator.userAgent,
      url: window.location.href,
      metadata: {
        ...metadata,
        isPremium: this.isUserPremium(),
        deviceType: this.getDeviceType(),
        timeOfDay: this.getTimeOfDay()
      }
    }

    // Store event locally
    this.events.push(event)

    // In production, send to analytics service
    this.sendToAnalytics(event)

    // Log for debugging
    console.log('Premium Analytics Event:', event)
  }

  /**
   * Check if current user is premium
   */
  isUserPremium() {
    try {
      const premiumData = localStorage.getItem('space4u_premium')
      if (premiumData) {
        const parsed = JSON.parse(premiumData)
        return parsed.isPremium || false
      }
    } catch (e) {
      console.warn('Error checking premium status:', e)
    }
    return false
  }

  /**
   * Get device type
   */
  getDeviceType() {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet'
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile'
    }
    return 'desktop'
  }

  /**
   * Get time of day category
   */
  getTimeOfDay() {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 22) return 'evening'
    return 'night'
  }

  /**
   * Send event to analytics service (mock implementation)
   */
  async sendToAnalytics(event) {
    try {
      // In production, this would send to your analytics service
      // For now, we'll just store in localStorage for demo purposes
      const storedEvents = JSON.parse(localStorage.getItem('space4u_analytics') || '[]')
      storedEvents.push(event)

      // Keep only last 100 events to prevent storage bloat
      if (storedEvents.length > 100) {
        storedEvents.splice(0, storedEvents.length - 100)
      }

      localStorage.setItem('space4u_analytics', JSON.stringify(storedEvents))

      // Mock API call (would be real in production)
      // await fetch('/api/analytics/track', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // })

    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }

  /**
   * Track premium feature view
   */
  trackFeatureView(featureKey, context = {}) {
    this.trackEvent('feature_view', featureKey, {
      ...context,
      action: 'viewed_premium_feature'
    })
  }

  /**
   * Track premium feature click/attempt
   */
  trackFeatureClick(featureKey, context = {}) {
    this.trackEvent('feature_click', featureKey, {
      ...context,
      action: 'clicked_premium_feature'
    })
  }

  /**
   * Track upgrade initiation
   */
  trackUpgradeStart(featureKey, planId, context = {}) {
    this.trackEvent('upgrade_start', featureKey, {
      ...context,
      planId,
      action: 'started_upgrade_flow'
    })
  }

  /**
   * Track upgrade completion
   */
  trackUpgradeComplete(featureKey, planId, amount, context = {}) {
    this.trackEvent('upgrade_complete', featureKey, {
      ...context,
      planId,
      amount,
      action: 'completed_upgrade'
    })
  }

  /**
   * Track upgrade cancellation
   */
  trackUpgradeCancel(featureKey, reason, context = {}) {
    this.trackEvent('upgrade_cancel', featureKey, {
      ...context,
      reason,
      action: 'cancelled_upgrade'
    })
  }

  /**
   * Track retargeting banner interaction
   */
  trackRetargetingInteraction(featureKey, action, context = {}) {
    this.trackEvent('retargeting_interaction', featureKey, {
      ...context,
      action: action // 'shown', 'clicked', 'dismissed'
    })
  }

  /**
   * Track premium feature usage
   */
  trackFeatureUsage(featureKey, usageType, context = {}) {
    this.trackEvent('feature_usage', featureKey, {
      ...context,
      usageType, // 'export', 'share', 'customize', etc.
      action: 'used_premium_feature'
    })
  }

  /**
   * Get analytics summary for dashboard
   */
  getAnalyticsSummary() {
    try {
      const events = JSON.parse(localStorage.getItem('space4u_analytics') || '[]')

      const summary = {
        totalEvents: events.length,
        featureViews: events.filter(e => e.eventType === 'feature_view').length,
        featureClicks: events.filter(e => e.eventType === 'feature_click').length,
        upgradesStarted: events.filter(e => e.eventType === 'upgrade_start').length,
        upgradesCompleted: events.filter(e => e.eventType === 'upgrade_complete').length,
        retargetingShown: events.filter(e => e.eventType === 'retargeting_interaction' && e.metadata.action === 'shown').length,
        retargetingClicked: events.filter(e => e.eventType === 'retargeting_interaction' && e.metadata.action === 'clicked').length,
        topFeatures: this.getTopFeatures(events),
        conversionRate: this.calculateConversionRate(events)
      }

      return summary
    } catch (error) {
      console.error('Failed to get analytics summary:', error)
      return {}
    }
  }

  /**
   * Get most interacted premium features
   */
  getTopFeatures(events) {
    const featureCounts = {}

    events.forEach(event => {
      if (event.featureKey) {
        featureCounts[event.featureKey] = (featureCounts[event.featureKey] || 0) + 1
      }
    })

    return Object.entries(featureCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([feature, count]) => ({ feature, count }))
  }

  /**
   * Calculate upgrade conversion rate
   */
  calculateConversionRate(events) {
    const started = events.filter(e => e.eventType === 'upgrade_start').length
    const completed = events.filter(e => e.eventType === 'upgrade_complete').length

    return started > 0 ? (completed / started * 100).toFixed(1) : 0
  }

  /**
   * Clear stored analytics data (for privacy/compliance)
   */
  clearAnalytics() {
    localStorage.removeItem('space4u_analytics')
    this.events = []
  }
}

// Create singleton instance
export const premiumAnalytics = new PremiumAnalytics()

// Export individual tracking functions for convenience
export const {
  trackEvent,
  trackFeatureView,
  trackFeatureClick,
  trackUpgradeStart,
  trackUpgradeComplete,
  trackUpgradeCancel,
  trackRetargetingInteraction,
  trackFeatureUsage,
  getAnalyticsSummary
} = premiumAnalytics

export default premiumAnalytics