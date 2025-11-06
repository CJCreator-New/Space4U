import { createContext, useContext, useState, useEffect } from 'react'
import { FEATURES } from '../config/features'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (!FEATURES.ENABLE_DARK_MODE) return 'light'
    const saved = localStorage.getItem('space4u_theme')
    return saved || 'light'
  })

  useEffect(() => {
    if (!FEATURES.ENABLE_DARK_MODE) return
    
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('space4u_theme', theme)
    updateStatusBar(theme)
  }, [theme])

  const updateStatusBar = async (currentTheme) => {
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar')
        const bgColor = currentTheme === 'dark' ? '#1F2937' : '#FFFFFF'
        const style = currentTheme === 'dark' ? Style.Light : Style.Dark
        
        await StatusBar.setBackgroundColor({ color: bgColor })
        await StatusBar.setStyle({ style })
      } catch (error) {
        // Silently fail on web
      }
    }
  }
  const toggleTheme = () => {
    if (!FEATURES.ENABLE_DARK_MODE) return
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
