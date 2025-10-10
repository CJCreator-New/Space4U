import { useEffect, useState } from 'react'
import { getMoodTheme, getTimeOfDayTheme } from '../../utils/adaptiveTheme'

function MoodResponsiveLayout({ children, moodRating }) {
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    if (!moodRating) return

    const moodTheme = getMoodTheme(moodRating)
    const timeTheme = getTimeOfDayTheme()
    
    setTheme({ ...moodTheme, ...timeTheme })
  }, [moodRating])

  if (!theme) return <div>{children}</div>

  return (
    <div 
      className="transition-colors duration-1000"
      style={{
        backgroundColor: theme.background,
        color: theme.text
      }}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
      
      {/* Mood indicator */}
      <div className="fixed bottom-4 right-4 px-3 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm"
           style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>
        {theme.name}
      </div>
    </div>
  )
}

export default MoodResponsiveLayout
