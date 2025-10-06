// Premium Feature Management System

export const PREMIUM_FEATURES = {
  UNLIMITED_HISTORY: 'unlimited_history',
  MOOD_PREDICTION: 'mood_prediction',
  THERAPIST_PORTAL: 'therapist_portal',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  PRIORITY_SUPPORT: 'priority_support',
  AD_FREE: 'ad_free',
  CUSTOM_SCALES: 'custom_scales',
  VOICE_UNLIMITED: 'voice_unlimited',
  GROUP_THERAPY: 'group_therapy',
  DETAILED_EXPORT: 'detailed_export'
}

export const checkPremiumStatus = () => {
  const data = localStorage.getItem('safespace_premium')
  if (!data) return { isPremium: false, trialActive: false }
  
  const premium = JSON.parse(data)
  const now = new Date()
  const trialEnd = new Date(premium.trialEndsAt)
  
  return {
    isPremium: premium.isPremium,
    trialActive: premium.trialActive && now < trialEnd,
    planType: premium.planType,
    trialEndsAt: premium.trialEndsAt,
    nextBillingDate: premium.nextBillingDate
  }
}

export const hasPremiumFeature = (feature) => {
  const { isPremium, trialActive } = checkPremiumStatus()
  return isPremium || trialActive
}

export const getPremiumDaysLeft = () => {
  const { trialActive, trialEndsAt } = checkPremiumStatus()
  if (!trialActive) return 0
  
  const now = new Date()
  const end = new Date(trialEndsAt)
  const diff = end - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const cancelPremium = () => {
  localStorage.removeItem('safespace_premium')
}

export const upgradeToPremium = (planType) => {
  const premiumData = {
    isPremium: true,
    trialActive: true,
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    planType,
    subscribedAt: new Date().toISOString(),
    nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
  localStorage.setItem('safespace_premium', JSON.stringify(premiumData))
  return premiumData
}
