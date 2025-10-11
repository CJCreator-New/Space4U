import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Share } from '@capacitor/share'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Preferences } from '@capacitor/preferences'

export function useCapacitor() {
  const [isNative, setIsNative] = useState(false)
  const [appState, setAppState] = useState('active')

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform())

    if (Capacitor.isNativePlatform()) {
      // App state listener
      App.addListener('appStateChange', ({ isActive }) => {
        setAppState(isActive ? 'active' : 'background')
      })

      // Back button handler
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp()
        } else {
          window.history.back()
        }
      })

      // Set status bar style
      StatusBar.setStyle({ style: Style.Dark })
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        App.removeAllListeners()
      }
    }
  }, [])

  const hapticFeedback = async (style = ImpactStyle.Medium) => {
    if (isNative) {
      await Haptics.impact({ style })
    }
  }

  const scheduleNotification = async (title, body, scheduleAt) => {
    if (isNative) {
      await LocalNotifications.schedule({
        notifications: [{
          title,
          body,
          id: Date.now(),
          schedule: { at: scheduleAt },
          sound: 'default',
          attachments: [],
          actionTypeId: '',
          extra: null
        }]
      })
    }
  }

  const shareContent = async (title, text, url) => {
    if (isNative) {
      await Share.share({ title, text, url })
    } else {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      }
    }
  }

  return {
    isNative,
    appState,
    hapticFeedback,
    scheduleNotification,
    shareContent
  }
}