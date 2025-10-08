import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getPremiumStatus,
  cancelPremium,
  reactivatePremium,
  checkAndUpdatePremiumStatus
} from './premiumUtils'

describe('premiumUtils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('getPremiumStatus', () => {
    it('should return non-premium status for no data', () => {
      const status = getPremiumStatus()
      expect(status.isPremium).toBe(false)
      expect(status.trialActive).toBe(false)
      expect(status.daysLeft).toBe(0)
    })

    it('should return premium status for active subscription', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        trialActive: true,
        trialEndsAt: futureDate,
        planType: 'monthly',
        nextBillingDate: futureDate
      }))

      const status = getPremiumStatus()
      expect(status.isPremium).toBe(true)
      expect(status.trialActive).toBe(true)
      expect(status.daysLeft).toBeGreaterThan(0)
      expect(status.planType).toBe('monthly')
    })

    it('should calculate days left correctly', () => {
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        trialActive: true,
        trialEndsAt: threeDaysFromNow
      }))

      const status = getPremiumStatus()
      expect(status.daysLeft).toBe(3)
    })

    it('should return 0 days left for expired trial', () => {
      const pastDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        trialActive: true,
        trialEndsAt: pastDate
      }))

      const status = getPremiumStatus()
      expect(status.trialActive).toBe(false)
      expect(status.daysLeft).toBe(0)
    })

    it('should handle missing trial data', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        trialActive: false
      }))

      const status = getPremiumStatus()
      expect(status.isPremium).toBe(true)
      expect(status.trialActive).toBe(false)
    })
  })

  describe('cancelPremium', () => {
    it('should mark premium as cancelled', () => {
      const billingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        planType: 'monthly',
        nextBillingDate: billingDate
      }))

      const result = cancelPremium()
      expect(result.cancelledAt).toBeTruthy()
      expect(result.willCancelAt).toBe(billingDate)
    })

    it('should preserve existing premium data', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        planType: 'yearly',
        nextBillingDate: '2025-12-31'
      }))

      const result = cancelPremium()
      expect(result.isPremium).toBe(true)
      expect(result.planType).toBe('yearly')
    })

    it('should save to localStorage', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        nextBillingDate: '2025-12-31'
      }))

      cancelPremium()
      const saved = JSON.parse(localStorage.getItem('safespace_premium'))
      expect(saved.cancelledAt).toBeTruthy()
    })
  })

  describe('reactivatePremium', () => {
    it('should remove cancellation data', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        cancelledAt: new Date().toISOString(),
        willCancelAt: '2025-12-31'
      }))

      const result = reactivatePremium()
      expect(result.cancelledAt).toBeNull()
      expect(result.willCancelAt).toBeNull()
    })

    it('should preserve other premium data', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        planType: 'monthly',
        cancelledAt: new Date().toISOString()
      }))

      const result = reactivatePremium()
      expect(result.isPremium).toBe(true)
      expect(result.planType).toBe('monthly')
    })

    it('should save to localStorage', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        cancelledAt: new Date().toISOString()
      }))

      reactivatePremium()
      const saved = JSON.parse(localStorage.getItem('safespace_premium'))
      expect(saved.cancelledAt).toBeNull()
    })
  })

  describe('checkAndUpdatePremiumStatus', () => {
    it('should return false for no premium data', () => {
      expect(checkAndUpdatePremiumStatus()).toBe(false)
    })

    it('should return true for active premium', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        nextBillingDate: futureDate
      }))

      expect(checkAndUpdatePremiumStatus()).toBe(true)
    })

    it('should deactivate expired trial', () => {
      const pastDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        trialActive: true,
        trialEndsAt: pastDate,
        nextBillingDate: futureDate
      }))

      checkAndUpdatePremiumStatus()
      const updated = JSON.parse(localStorage.getItem('safespace_premium'))
      expect(updated.trialActive).toBe(false)
    })

    it('should remove premium if cancelled and billing date passed', () => {
      const pastDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        willCancelAt: pastDate,
        nextBillingDate: pastDate
      }))

      const result = checkAndUpdatePremiumStatus()
      expect(result).toBe(false)
      expect(localStorage.getItem('safespace_premium')).toBeNull()
    })

    it('should keep premium if cancelled but billing date not passed', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        willCancelAt: futureDate,
        nextBillingDate: futureDate
      }))

      const result = checkAndUpdatePremiumStatus()
      expect(result).toBe(true)
      expect(localStorage.getItem('safespace_premium')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('safespace_premium', 'invalid json')
      expect(() => getPremiumStatus()).toThrow()
    })

    it('should handle empty premium object', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({}))
      const status = getPremiumStatus()
      expect(status.isPremium).toBe(false)
    })

    it('should handle missing dates gracefully', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true
      }))
      
      const status = getPremiumStatus()
      expect(status.isPremium).toBe(true)
    })
  })

  describe('Mental Health Context', () => {
    it('should never lose premium access immediately on cancel', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        nextBillingDate: futureDate
      }))

      const result = cancelPremium()
      expect(result.isPremium).toBe(true)
      expect(result.willCancelAt).toBe(futureDate)
    })

    it('should allow reactivation before cancellation takes effect', () => {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        cancelledAt: new Date().toISOString(),
        willCancelAt: '2025-12-31'
      }))

      const result = reactivatePremium()
      expect(result.cancelledAt).toBeNull()
      expect(result.isPremium).toBe(true)
    })
  })
})
