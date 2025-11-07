import { createContext, useContext, useState, useEffect } from 'react'
import { getPremiumStatus } from '../utils/premiumUtils'

const PremiumContext = createContext()

export function PremiumProvider({ children }) {
  const [premiumState, setPremiumState] = useState({
    isPremium: false,
    trialActive: false,
    trialEndsAt: null,
    planType: null,
    subscribedAt: null,
    nextBillingDate: null,
    loading: true
  })

  const refreshPremiumStatus = () => {
    const status = getPremiumStatus()
    setPremiumState({
      ...status,
      loading: false
    })
  }

  useEffect(() => {
    refreshPremiumStatus()

    // Listen for storage changes (when premium status is updated in another tab or component)
    const handleStorageChange = (e) => {
      if (e.key === 'space4u_premium') {
        refreshPremiumStatus()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Listen for custom premium update events
    const handlePremiumUpdate = () => {
      refreshPremiumStatus()
    }

    window.addEventListener('premiumStatusUpdated', handlePremiumUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('premiumStatusUpdated', handlePremiumUpdate)
    }
  }, [])

  return (
    <PremiumContext.Provider value={{ ...premiumState, refreshPremiumStatus }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider')
  }
  return context
}
