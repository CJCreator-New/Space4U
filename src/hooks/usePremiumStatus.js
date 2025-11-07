import { usePremium } from '../contexts/PremiumContext'

/**
 * Hook to access premium status from context
 * Use this instead of getPremiumStatus() for reactive updates
 */
export function usePremiumStatus() {
  const { isPremium, trialActive, trialEndsAt, planType, loading, refreshPremiumStatus } = usePremium()
  
  return {
    isPremium,
    trialActive,
    trialEndsAt,
    planType,
    loading,
    refresh: refreshPremiumStatus
  }
}
