import { useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { THEMES, getUserTheme, setUserTheme } from '../utils/themes'

function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState(getUserTheme())

  const handleSelect = (themeId) => {
    setSelectedTheme(themeId)
    setUserTheme(themeId)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2 flex items-center gap-2">
          <Palette size={20} />
          App Theme
        </h3>
        <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
          Personalize your Space4U experience
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.values(THEMES).map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleSelect(theme.id)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selectedTheme === theme.id
                ? 'border-primary scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
            }`}
          >
            {selectedTheme === theme.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="text-white" size={14} />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex gap-1">
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: theme.secondary }}
                />
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
              <div>
                <p className="font-medium text-sm text-text-primary dark:text-white">
                  {theme.name}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 <strong>Tip:</strong> Theme changes apply immediately. Refresh the page to see full effect.
        </p>
      </div>
    </div>
  )
}

export default ThemeCustomizer
