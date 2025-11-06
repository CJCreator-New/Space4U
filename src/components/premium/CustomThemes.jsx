import { useState } from 'react'
import { Palette, Check } from 'lucide-react'

function CustomThemes() {
  const [activeTheme, setActiveTheme] = useState('default')

  const themes = [
    { id: 'default', name: 'Ocean Blue', colors: ['#3B82F6', '#1E40AF', '#DBEAFE'] },
    { id: 'sunset', name: 'Sunset Orange', colors: ['#F97316', '#EA580C', '#FFEDD5'] },
    { id: 'forest', name: 'Forest Green', colors: ['#10B981', '#059669', '#D1FAE5'] },
    { id: 'lavender', name: 'Lavender Dream', colors: ['#A78BFA', '#7C3AED', '#EDE9FE'] },
    { id: 'rose', name: 'Rose Garden', colors: ['#F43F5E', '#E11D48', '#FFE4E6'] },
    { id: 'midnight', name: 'Midnight Blue', colors: ['#1E293B', '#0F172A', '#CBD5E1'] },
    { id: 'coral', name: 'Coral Reef', colors: ['#FB7185', '#F43F5E', '#FECDD3'] },
    { id: 'mint', name: 'Mint Fresh', colors: ['#34D399', '#10B981', '#D1FAE5'] }
  ]

  const applyTheme = (themeId) => {
    setActiveTheme(themeId)
    localStorage.setItem('space4u_theme', themeId)
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        <Palette className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Custom Themes</h2>
        <p className="opacity-90">Personalize your experience with 8 beautiful themes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {themes.map(theme => (
          <div
            key={theme.id}
            onClick={() => applyTheme(theme.id)}
            className={`card p-6 cursor-pointer transition-all hover:scale-105 ${
              activeTheme === theme.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{theme.name}</h3>
              {activeTheme === theme.id && <Check className="w-6 h-6 text-primary" />}
            </div>
            <div className="flex gap-2">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-full h-16 rounded-lg"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 bg-purple-50">
        <h3 className="font-bold mb-2">Theme Benefits</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Choose colors that match your mood</li>
          <li>• Reduce eye strain with darker themes</li>
          <li>• Make the app feel truly yours</li>
          <li>• Switch themes anytime</li>
        </ul>
      </div>
    </div>
  )
}

export default CustomThemes

