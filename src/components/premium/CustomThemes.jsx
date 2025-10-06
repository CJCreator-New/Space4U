import { useState } from 'react'
import { Palette, Check } from 'lucide-react'

const THEMES = [
  { id: 'ocean', name: 'Ocean Breeze', primary: '#0EA5E9', secondary: '#06B6D4', bg: '#F0F9FF' },
  { id: 'sunset', name: 'Sunset Glow', primary: '#F97316', secondary: '#FB923C', bg: '#FFF7ED' },
  { id: 'forest', name: 'Forest Green', primary: '#10B981', secondary: '#34D399', bg: '#F0FDF4' },
  { id: 'lavender', name: 'Lavender Dream', primary: '#A855F7', secondary: '#C084FC', bg: '#FAF5FF' },
  { id: 'rose', name: 'Rose Garden', primary: '#EC4899', secondary: '#F472B6', bg: '#FDF2F8' },
  { id: 'midnight', name: 'Midnight Blue', primary: '#3B82F6', secondary: '#60A5FA', bg: '#EFF6FF' },
  { id: 'autumn', name: 'Autumn Leaves', primary: '#EA580C', secondary: '#F59E0B', bg: '#FFF7ED' },
  { id: 'mint', name: 'Fresh Mint', primary: '#14B8A6', secondary: '#2DD4BF', bg: '#F0FDFA' }
]

function CustomThemes() {
  const [selectedTheme, setSelectedTheme] = useState('ocean')

  const applyTheme = (theme) => {
    setSelectedTheme(theme.id)
    document.documentElement.style.setProperty('--primary', theme.primary)
    document.documentElement.style.setProperty('--primary-light', theme.secondary)
    document.documentElement.style.setProperty('--background', theme.bg)
    localStorage.setItem('safespace_theme', theme.id)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Palette size={32} />
          <div>
            <h3 className="text-xl font-bold">Custom Themes</h3>
            <p className="opacity-90">Personalize your experience</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="font-semibold text-text-primary mb-4">Choose Your Theme</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selectedTheme === theme.id
                  ? 'border-primary shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-text-primary">{theme.name}</span>
                {selectedTheme === theme.id && (
                  <Check className="text-primary" size={20} />
                )}
              </div>
              <div className="flex gap-2">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: theme.secondary }}
                />
                <div
                  className="w-12 h-12 rounded-lg border border-gray-200"
                  style={{ backgroundColor: theme.bg }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2">🎨 Theme Features</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 8 premium themes included</li>
          <li>• Instant theme switching</li>
          <li>• Syncs across devices</li>
          <li>• More themes added monthly</li>
        </ul>
      </div>
    </div>
  )
}

export default CustomThemes
