export const getPremiumStatus = () => {
  const premiumData = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
  
  if (!premiumData.isPremium) {
    return { isPremium: false, trialActive: false, daysLeft: 0 }
  }

  const now = new Date()
  const trialEnd = new Date(premiumData.trialEndsAt)
  const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))

  return {
    isPremium: premiumData.isPremium,
    trialActive: premiumData.trialActive && daysLeft > 0,
    daysLeft: Math.max(0, daysLeft),
    planType: premiumData.planType,
    nextBillingDate: premiumData.nextBillingDate
  }
}

export const cancelPremium = () => {
  const premiumData = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
  
  // Keep premium until billing date
  const updatedData = {
    ...premiumData,
    cancelledAt: new Date().toISOString(),
    willCancelAt: premiumData.nextBillingDate
  }
  
  localStorage.setItem('space4u_premium', JSON.stringify(updatedData))
  return updatedData
}

export const reactivatePremium = () => {
  const premiumData = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
  
  const updatedData = {
    ...premiumData,
    cancelledAt: null,
    willCancelAt: null
  }
  
  localStorage.setItem('space4u_premium', JSON.stringify(updatedData))
  return updatedData
}

export const checkAndUpdatePremiumStatus = () => {
  const premiumData = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
  
  if (!premiumData.isPremium) return false

  const now = new Date()
  const billingDate = new Date(premiumData.nextBillingDate)

  // Check if trial ended
  if (premiumData.trialActive) {
    const trialEnd = new Date(premiumData.trialEndsAt)
    if (now > trialEnd) {
      premiumData.trialActive = false
      localStorage.setItem('space4u_premium', JSON.stringify(premiumData))
    }
  }

  // Check if subscription should be cancelled
  if (premiumData.willCancelAt && now > billingDate) {
    localStorage.removeItem('space4u_premium')
    return false
  }

  return true
}

export const startFreeTrial = () => {
  const now = new Date()
  const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const billingDate = new Date(trialEnd.getTime() + 1 * 24 * 60 * 60 * 1000) // 1 day after trial
  
  const premiumData = {
    isPremium: true,
    trialActive: true,
    trialEndsAt: trialEnd.toISOString(),
    planType: 'monthly',
    nextBillingDate: billingDate.toISOString(),
    startedAt: now.toISOString()
  }
  
  localStorage.setItem('space4u_premium', JSON.stringify(premiumData))
  return premiumData
}

