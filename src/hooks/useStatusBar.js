import { useEffect } from 'react'

export function useStatusBar(options = {}) {
  const {
    backgroundColor = '#FFFFFF',
    style = 'dark',
    overlay = false
  } = options

  useEffect(() => {
    const updateStatusBar = async () => {
      if (window.Capacitor) {
        try {
          const { StatusBar, Style } = await import('@capacitor/status-bar')
          
          await StatusBar.setBackgroundColor({ color: backgroundColor })
          await StatusBar.setStyle({ 
            style: style === 'dark' ? Style.Dark : Style.Light 
          })
          await StatusBar.setOverlaysWebView({ overlay })
        } catch (error) {
          console.log('StatusBar not available:', error)
        }
      }
    }

    updateStatusBar()
  }, [backgroundColor, style, overlay])

  const hide = async () => {
    if (window.Capacitor) {
      const { StatusBar } = await import('@capacitor/status-bar')
      await StatusBar.hide()
    }
  }

  const show = async () => {
    if (window.Capacitor) {
      const { StatusBar } = await import('@capacitor/status-bar')
      await StatusBar.show()
    }
  }

  return { hide, show }
}
