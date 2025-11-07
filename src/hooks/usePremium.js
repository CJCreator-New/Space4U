import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * usePremium - Hook for premium feature access control
 * @param {Object} user - User object with isPremium flag
 * @returns {Object} Premium utilities
 */
export function usePremium(user) {
  const navigate = useNavigate()
  const isPremium = !!user?.isPremium

  const requestUpgrade = useCallback((featureKey, returnTo) => {
    const currentPath = returnTo || (window.location.pathname + window.location.search)
    const encodedReturnTo = encodeURIComponent(currentPath)
    navigate(`/upgrade?returnTo=${encodedReturnTo}&triggerFeature=${featureKey}`)
  }, [navigate])

  const checkAccess = useCallback((featureKey) => {
    // This could be extended to check specific feature flags
    return isPremium
  }, [isPremium])

  return {
    isPremium,
    requestUpgrade,
    checkAccess
  }
}

export default usePremium