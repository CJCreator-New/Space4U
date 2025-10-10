// Usage Tracker - Track user behavior patterns locally

import { getPersonalization, updatePersonalization } from './personalizationEngine'

export const trackFeatureUsage = (featureId, duration = 0) => {
  const config = getPersonalization()
  if (!config.enabled) return

  const features = config.usage?.features || {}
  const existing = features[featureId] || { count: 0, lastUsed: null, avgDuration: 0, totalDuration: 0 }

  const updated = {
    count: existing.count + 1,
    lastUsed: new Date().toISOString(),
    totalDuration: existing.totalDuration + duration,
    avgDuration: Math.round((existing.totalDuration + duration) / (existing.count + 1))
  }

  features[featureId] = updated

  updatePersonalization({
    usage: { ...config.usage, features }
  })
}

export const trackTimePattern = (featureId) => {
  const config = getPersonalization()
  if (!config.enabled) return

  const hour = new Date().getHours()
  const timePatterns = config.usage?.timePatterns || {}
  const hourPatterns = timePatterns[hour] || []

  if (!hourPatterns.includes(featureId)) {
    hourPatterns.push(featureId)
  }

  timePatterns[hour] = hourPatterns

  updatePersonalization({
    usage: { ...config.usage, timePatterns }
  })
}

export const detectSessionPreference = (duration) => {
  const config = getPersonalization()
  if (!config.enabled) return

  const preference = duration < 120 ? 'quick' : duration > 600 ? 'deep' : 'balanced'

  updatePersonalization({
    usage: { ...config.usage, sessionPreference: preference }
  })
}

export const setInputPreference = (type) => {
  const config = getPersonalization()
  updatePersonalization({
    usage: { ...config.usage, inputPreference: type }
  })
}

export const setContentPreference = (type) => {
  const config = getPersonalization()
  updatePersonalization({
    usage: { ...config.usage, contentPreference: type }
  })
}

export const getMostUsedFeatures = (limit = 6) => {
  const config = getPersonalization()
  const features = config.usage?.features || {}

  return Object.entries(features)
    .sort(([, a], [, b]) => {
      const scoreA = a.count * 0.7 + (Date.now() - new Date(a.lastUsed).getTime() < 86400000 ? 100 : 0)
      const scoreB = b.count * 0.7 + (Date.now() - new Date(b.lastUsed).getTime() < 86400000 ? 100 : 0)
      return scoreB - scoreA
    })
    .slice(0, limit)
    .map(([id]) => id)
}

export const getTimeBasedFeatures = () => {
  const config = getPersonalization()
  const hour = new Date().getHours()
  return config.usage?.timePatterns?.[hour] || []
}
