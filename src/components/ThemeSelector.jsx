import { useState } from 'react'
import { Check } from 'lucide-react'

const THEMES = [
  { id: 'default', name: 'Default', primary: '#4F46E5', secondary: '#10B981' },
  { id: 'ocean', name: 'Ocean', primary: '#0EA5E9', secondary: '#06B6D4' },
  { id: 'sunset', name: 'Sunset', primary: '#F59E0B', secondary: '#EF4444' },
  { id: 'forest', name: 'Forest', primary: '#10B981', secondary: '#059669' },
  { id: 'lavender', name: 'Lavender', primary: '#8B5CF6', secondary: '#A78BFA' },
  { id: 'rose', name: 'Rose', primary: '#EC4899', secondary: '#F472B6' },
  { id: 'midnight', name: 'Midnight', primary: '#1E293B', secondary: '#475569' },
  { id: 'coral', name: 'Coral', primary: '#FB7185', secondary: '#FBBF24' }
]

function ThemeSelector({ isPremium }) {
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem('space4u_color_theme') || 'default'
  )

  const handleSelectTheme = (themeId) => {
    if (!isPremium && themeId !== 'default') {
      window.location.href = '/premium'
      return
    }
    
    setSelectedTheme(themeId)
    localStorage.setItem('space4u_color_theme', themeId)
    
    const theme = THEMES.find(t => t.id === themeId)
    document.documentElement.style.setProperty('--primary', theme.primary)
    document.documentElement.style.setProperty('--secondary', theme.secondary)
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Color Themes</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {THEMES.map((theme) => {
          const isLocked = !isPremium && theme.id !== 'default'
          const isSelected = selectedTheme === theme.id
          
          return (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              disabled={isLocked}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected ? 'border-primary' : 'border-gray-200'
              } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}
            >
              <div className="flex gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: theme.secondary }}
                />
              </div>
              <div className="text-sm font-medium">{theme.name}</div>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <Check size={12} />
                </div>
              )}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                  <span className="text-xs font-medium text-gray-600">Premium</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeSelector
