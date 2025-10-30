import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('safespace_theme')
    return saved || 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('safespace_theme', theme)
    
    // Update status bar on theme change
    updateStatusBar(theme)
  }, [theme])

  const updateStatusBar = async (currentTheme) => {
    // Only attempt to use the Capacitor StatusBar on native platforms.
    // On web the plugin isn't implemented and will throw - skip silently.
    if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.platform && window.Capacitor.platform !== 'web') {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar')
        const bgColor = currentTheme === 'dark' ? '#1F2937' : '#FFFFFF'
        const style = currentTheme === 'dark' ? Style.Light : Style.Dark

        await StatusBar.setBackgroundColor({ color: bgColor })
        await StatusBar.setStyle({ style })
      } catch (error) {
        // Keep this low-noise; native platforms will rarely hit this.
        console.debug('StatusBar not available (native check passed):', error)
      }
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
