import { Haptics } from '@capacitor/haptics'

export function useHaptic() {
  const vibrate = async (type = 'light') => {
    try {
      if (window.Capacitor?.isNativePlatform()) {
        switch (type) {
          case 'light':
            await Haptics.impact({ style: 'light' })
            break
          case 'medium':
            await Haptics.impact({ style: 'medium' })
            break
          case 'heavy':
            await Haptics.impact({ style: 'heavy' })
            break
          case 'success':
            await Haptics.notification({ type: 'success' })
            break
          case 'warning':
            await Haptics.notification({ type: 'warning' })
            break
          case 'error':
            await Haptics.notification({ type: 'error' })
            break
          default:
            await Haptics.impact({ style: 'light' })
        }
      } else if (navigator.vibrate) {
        const duration = type === 'heavy' ? 50 : type === 'medium' ? 30 : 10
        navigator.vibrate(duration)
      }
    } catch (error) {
      console.log('Haptic feedback not available')
    }
  }

  return { vibrate }
}
