// Analytics utility for tracking user interactions

export const trackEvent = (eventName, properties = {}) => {
  try {
    const events = JSON.parse(localStorage.getItem('space4u_analytics') || '[]')
    
    events.push({
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId()
    })
    
    // Keep only last 1000 events
    if (events.length > 1000) {
      events.splice(0, events.length - 1000)
    }
    
    localStorage.setItem('space4u_analytics', JSON.stringify(events))
    
    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('ðŸ“Š Analytics:', eventName, properties)
    }
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('space4u_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('space4u_session_id', sessionId)
  }
  return sessionId
}

// Predefined events
export const EVENTS = {
  // Home page
  MOOD_LOG_OPENED: 'mood_log_opened',
  MOOD_LOG_SUBMITTED: 'mood_log_submitted',
  CIRCLE_RECOMMENDATION_VIEWED: 'circle_recommendation_viewed',
  TOOL_LIST_OPENED: 'tool_list_opened',
  WELCOME_BANNER_DISMISSED: 'welcome_banner_dismissed',
  
  // Circles
  CIRCLE_VIEWED: 'circle_viewed',
  CIRCLE_JOINED: 'circle_joined',
  CIRCLE_LEFT: 'circle_left',
  CIRCLE_ACTIVITY_BADGE_VIEWED: 'circle_activity_badge_viewed',
  CIRCLE_SORT_SELECTED: 'circle_sort_selected',
  CIRCLE_JOIN_CTA_SHOWN: 'circle_join_cta_shown',
  CIRCLE_JOIN_CTA_CLICKED: 'circle_join_cta_clicked',
  CIRCLE_JOIN_CTA_DISMISSED: 'circle_join_cta_dismissed',
  
  // Insights
  INSIGHT_TOOLTIP_OPENED: 'insight_tooltip_opened',
  INSIGHT_ACTION_CLICKED: 'insight_action_clicked',
  INSIGHT_EXPLORE_TOOLS: 'insight_explore_tools_clicked',
  INSIGHT_FIND_SUPPORT: 'insight_find_support_clicked',
  
  // Tools
  TOOL_LAUNCHED: 'tool_launched',
  TOOL_BOOKMARKED: 'tool_bookmarked',
  
  // General
  PAGE_VIEWED: 'page_viewed',
  FEATURE_USED: 'feature_used'
}

// Helper to track page views
export const trackPageView = (pageName) => {
  trackEvent(EVENTS.PAGE_VIEWED, { page: pageName })
}

// Helper to track feature usage
export const trackFeature = (featureName, metadata = {}) => {
  trackEvent(EVENTS.FEATURE_USED, { feature: featureName, ...metadata })
}

// Get analytics summary
export const getAnalyticsSummary = () => {
  try {
    const events = JSON.parse(localStorage.getItem('space4u_analytics') || '[]')
    
    const summary = {
      totalEvents: events.length,
      uniqueSessions: new Set(events.map(e => e.sessionId)).size,
      eventCounts: {},
      recentEvents: events.slice(-10)
    }
    
    events.forEach(event => {
      summary.eventCounts[event.event] = (summary.eventCounts[event.event] || 0) + 1
    })
    
    return summary
  } catch (error) {
    console.error('Error getting analytics summary:', error)
    return null
  }
}

