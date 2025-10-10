// Core Personalization Engine - Privacy-First, Local-Only Processing

export const initPersonalization = () => {
  const existing = localStorage.getItem('safespace_personalization')
  if (!existing) {
    const defaultConfig = {
      enabled: true,
      lastUpdated: new Date().toISOString(),
      usage: { features: {}, timePatterns: {}, sessionPreference: 'balanced', inputPreference: 'text', contentPreference: 'balanced' },
      recommendations: { current: [], dismissed: [], feedback: {} },
      insights: { moodPatterns: { triggers: [], positiveInfluences: [] }, effectiveStrategies: [], seasonalPatterns: [] },
      preferences: { dashboardLayout: 'adaptive', recommendationFrequency: 'medium', helpLevel: 'full' }
    }
    localStorage.setItem('safespace_personalization', JSON.stringify(defaultConfig))
    return defaultConfig
  }
  return JSON.parse(existing)
}

export const getPersonalization = () => {
  return JSON.parse(localStorage.getItem('safespace_personalization') || '{}')
}

export const updatePersonalization = (updates) => {
  const current = getPersonalization()
  const updated = { ...current, ...updates, lastUpdated: new Date().toISOString() }
  localStorage.setItem('safespace_personalization', JSON.stringify(updated))
  return updated
}

export const resetPersonalization = () => {
  localStorage.removeItem('safespace_personalization')
  return initPersonalization()
}

export const isPersonalizationEnabled = () => {
  const config = getPersonalization()
  return config.enabled !== false
}

export const togglePersonalization = (enabled) => {
  return updatePersonalization({ enabled })
}
