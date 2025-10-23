import { useState, useEffect } from 'react'

export function useBiometric() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [biometricType, setBiometricType] = useState(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const { Capacitor } = await import('@capacitor/core')
        if (Capacitor.getPlatform() === 'web') {
          if (mounted) setIsAvailable(false)
          return
        }

        let pluginModule = null
        try {
          pluginModule = await import('@capacitor-community/biometric-auth')
        } catch (e1) {
          try {
            pluginModule = await import('@capacitor/biometric-auth')
          } catch (e2) {
            console.warn('Biometric plugin not found')
          }
        }

        if (!pluginModule) {
          if (mounted) setIsAvailable(false)
          return
        }

        const api = pluginModule?.BiometricAuth ?? pluginModule?.default ?? pluginModule
        if (typeof api?.checkBiometry === 'function') {
          const result = await api.checkBiometry()
          if (mounted) {
            setIsAvailable(result.isAvailable)
            setBiometricType(result.biometryType)
          }
        }
      } catch (err) {
        console.warn('useBiometric init error', err)
        if (mounted) setIsAvailable(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const authenticate = async (reason = 'Authenticate to continue') => {
    try {
      const { Capacitor } = await import('@capacitor/core')
      if (Capacitor.getPlatform() === 'web') {
        return { success: false, error: 'Not running on native device' }
      }

      let pluginModule = null
      try {
        pluginModule = await import('@capacitor-community/biometric-auth')
      } catch {
        pluginModule = await import('@capacitor/biometric-auth').catch(() => null)
      }

      const api = pluginModule?.BiometricAuth ?? pluginModule?.default ?? pluginModule
      if (typeof api?.authenticate === 'function') {
        await api.authenticate({ reason })
        return { success: true }
      }
      return { success: false, error: 'Biometric plugin not available' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const checkAvailability = async () => {
    try {
      const { Capacitor } = await import('@capacitor/core')
      if (Capacitor.getPlatform() === 'web') return

      let pluginModule = null
      try {
        pluginModule = await import('@capacitor-community/biometric-auth')
      } catch {
        pluginModule = await import('@capacitor/biometric-auth').catch(() => null)
      }

      if (pluginModule) {
        const api = pluginModule?.BiometricAuth ?? pluginModule?.default ?? pluginModule
        if (typeof api?.checkBiometry === 'function') {
          const result = await api.checkBiometry()
          setIsAvailable(result.isAvailable)
          setBiometricType(result.biometryType)
        }
      }
    } catch (error) {
      console.warn('checkAvailability error', error)
    }
  }

  return { isAvailable, biometricType, authenticate, checkAvailability }
}
