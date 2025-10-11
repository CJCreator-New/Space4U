import { useState, useEffect } from 'react'

export function useBiometric() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [biometricType, setBiometricType] = useState(null)

  useEffect(() => {
    checkAvailability()
  }, [])

  const checkAvailability = async () => {
    try {
      // Check if running in Capacitor
      if (window.Capacitor) {
        const { BiometricAuth } = await import('@capacitor/biometric-auth')
        const result = await BiometricAuth.checkBiometry()
        setIsAvailable(result.isAvailable)
        setBiometricType(result.biometryType)
      }
    } catch (error) {
      console.log('Biometric not available:', error)
      setIsAvailable(false)
    }
  }

  const authenticate = async (reason = 'Authenticate to continue') => {
    try {
      if (!window.Capacitor) {
        return { success: false, error: 'Not running on native device' }
      }

      const { BiometricAuth } = await import('@capacitor/biometric-auth')
      await BiometricAuth.authenticate({ reason })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return { isAvailable, biometricType, authenticate, checkAvailability }
}
