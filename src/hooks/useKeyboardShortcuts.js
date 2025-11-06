import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useKeyboardShortcuts = (customShortcuts = {}) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      // Ctrl/Cmd + key shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'm':
            e.preventDefault()
            navigate('/')
            break
          case 'c':
            e.preventDefault()
            navigate('/circles')
            break
          case 't':
            e.preventDefault()
            navigate('/resources')
            break
          case 'i':
            e.preventDefault()
            navigate('/insights')
            break
          case 'g':
            e.preventDefault()
            navigate('/gratitude')
            break
          default:
            break
        }
      }

      // Custom shortcuts
      if (customShortcuts[e.key]) {
        e.preventDefault()
        customShortcuts[e.key]()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [navigate, customShortcuts])
}

export const SHORTCUTS = {
  HOME: 'Ctrl/Cmd + M',
  CIRCLES: 'Ctrl/Cmd + C',
  TOOLS: 'Ctrl/Cmd + T',
  INSIGHTS: 'Ctrl/Cmd + I',
  GRATITUDE: 'Ctrl/Cmd + G'
}
