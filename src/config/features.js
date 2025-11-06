/**
 * Feature Flags Configuration
 * Control new features and backend integration with zero-risk toggles
 */

export const FEATURES = {
  // Backend Integration
  USE_BACKEND: true,              // Toggle Supabase backend (default: localStorage)
  ENABLE_REALTIME: false,          // Real-time updates via WebSocket
  ENABLE_SYNC: false,              // Cross-device sync
  
  // UI Enhancements (Safe to enable)
  ENABLE_DARK_MODE: true,          // Dark mode theme
  ENABLE_SEARCH: true,             // Global search functionality
  ENABLE_ENHANCED_EXPORT: true,    // PDF/CSV export improvements
  
  // Advanced Features
  ENABLE_ML_PREDICTIONS: false,    // AI mood predictions
  ENABLE_VOICE_JOURNAL: false,     // Voice-to-text journaling
  ENABLE_OFFLINE_QUEUE: false,     // Offline sync queue
  
  // Social Features
  ENABLE_DIRECT_MESSAGES: false,   // DM between users
  ENABLE_VIDEO_SESSIONS: false,    // Group video calls
  
  // Professional Features
  ENABLE_THERAPIST_PORTAL: false,  // Therapist dashboard
  ENABLE_DATA_SHARING: false,      // Share data with professionals
  
  // Developer Tools
  DEVELOPER_MODE: false,           // Enable dev tools and debugging
  ENABLE_ERROR_TRACKING: false,    // Sentry integration
  ENABLE_ANALYTICS: false          // Privacy-respecting analytics
}

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature flag
 * @returns {boolean}
 */
export function isFeatureEnabled(featureName) {
  return FEATURES[featureName] === true
}

/**
 * Enable a feature at runtime (for testing)
 * @param {string} featureName - Name of the feature flag
 */
export function enableFeature(featureName) {
  if (featureName in FEATURES) {
    FEATURES[featureName] = true
    localStorage.setItem(`space4u_feature_${featureName}`, 'true')
  }
}

/**
 * Disable a feature at runtime
 * @param {string} featureName - Name of the feature flag
 */
export function disableFeature(featureName) {
  if (featureName in FEATURES) {
    FEATURES[featureName] = false
    localStorage.setItem(`space4u_feature_${featureName}`, 'false')
  }
}

/**
 * Load feature flags from localStorage (persisted user preferences)
 */
export function loadFeatureFlags() {
  Object.keys(FEATURES).forEach(key => {
    const saved = localStorage.getItem(`space4u_feature_${key}`)
    if (saved !== null) {
      FEATURES[key] = saved === 'true'
    }
  })
}

// Auto-load on import
loadFeatureFlags()
