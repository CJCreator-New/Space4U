// Recommendation Engine - Generate personalized feature suggestions

import { getPersonalization, updatePersonalization } from './personalizationEngine'

const FEATURE_MAP = {
  anxiety: ['breathing-exercises', 'worry-scheduler', 'coping-skills', 'dbt-skills'],
  depression: ['gratitude', 'habits', 'social', 'therapy-prep'],
  stress: ['breathing-exercises', 'meditation', 'sleep-tracker', 'wellness-plan'],
  journaling: ['gratitude', 'emotion-tracker', 'therapy-prep', 'voice-journal'],
  social: ['circles', 'peer-support', 'accountability', 'private-groups']
}

export const generateRecommendations = () => {
  const config = getPersonalization()
  if (!config.enabled) return []

  const recommendations = []

  // Goal-based recommendations
  const goals = JSON.parse(localStorage.getItem('safespace_user_profile') || '{}').goals || []
  goals.forEach(goal => {
    const features = FEATURE_MAP[goal] || []
    features.forEach(feature => {
      if (!isFeatureUsed(feature)) {
        recommendations.push({
          featureId: feature,
          reason: `Recommended for your ${goal} goal`,
          priority: 'high',
          timestamp: new Date().toISOString()
        })
      }
    })
  })

  // Mood-based recommendations
  const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
  const recentMoods = Object.values(moods).slice(-7)
  const avgMood = recentMoods.reduce((sum, m) => sum + m.rating, 0) / recentMoods.length

  if (avgMood < 3) {
    recommendations.push({
      featureId: 'crisis-support',
      reason: 'Your recent mood shows you might need extra support',
      priority: 'urgent',
      timestamp: new Date().toISOString()
    })
  }

  // Engagement-based recommendations
  const usage = config.usage?.features || {}
  const mostUsed = Object.entries(usage).sort(([, a], [, b]) => b.count - a.count)[0]
  
  if (mostUsed && mostUsed[1].count > 5) {
    const [featureId] = mostUsed
    const related = getRelatedFeatures(featureId)
    related.forEach(feature => {
      if (!isFeatureUsed(feature)) {
        recommendations.push({
          featureId: feature,
          reason: `You might also like this based on your use of ${featureId}`,
          priority: 'medium',
          timestamp: new Date().toISOString()
        })
      }
    })
  }

  // Remove dismissed and limit to top 5
  const dismissed = config.recommendations?.dismissed || []
  return recommendations
    .filter(r => !dismissed.includes(r.featureId))
    .sort((a, b) => {
      const priority = { urgent: 3, high: 2, medium: 1, low: 0 }
      return priority[b.priority] - priority[a.priority]
    })
    .slice(0, 5)
}

export const dismissRecommendation = (featureId) => {
  const config = getPersonalization()
  const dismissed = config.recommendations?.dismissed || []
  dismissed.push(featureId)
  
  updatePersonalization({
    recommendations: { ...config.recommendations, dismissed }
  })
}

export const provideFeedback = (featureId, helpful) => {
  const config = getPersonalization()
  const feedback = config.recommendations?.feedback || {}
  feedback[featureId] = helpful ? 'helpful' : 'not-helpful'
  
  updatePersonalization({
    recommendations: { ...config.recommendations, feedback }
  })
}

const isFeatureUsed = (featureId) => {
  const config = getPersonalization()
  return !!config.usage?.features?.[featureId]
}

const getRelatedFeatures = (featureId) => {
  const relations = {
    'gratitude': ['journaling', 'mood-tracker', 'habits'],
    'habits': ['wellness-plan', 'reminders', 'challenges'],
    'mood-tracker': ['emotion-tracker', 'analytics', 'insights'],
    'circles': ['social', 'peer-support', 'private-groups']
  }
  return relations[featureId] || []
}

export const checkInactiveFeatures = () => {
  const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
  const lastMood = Object.values(moods).slice(-1)[0]
  const daysSinceLastMood = lastMood ? Math.floor((Date.now() - new Date(lastMood.date).getTime()) / 86400000) : 999

  return daysSinceLastMood >= 3
}
