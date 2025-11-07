import { Sun, Moon, Monitor, Type, Zap, Layout, Smile } from 'lucide-react'

function AppearanceSettings({ settings, updateSetting, theme, setLightTheme, setDarkTheme, setAutoTheme, isSettingModified }) {
  return (
    <div className="border-t border-gray-100">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-yellow-500" />
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-gray-600">Choose your preferred theme</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { value: 'light', icon: Sun, label: 'Light', action: setLightTheme },
              { value: 'dark', icon: Moon, label: 'Dark', action: setDarkTheme },
              { value: 'auto', icon: Monitor, label: 'Auto', action: setAutoTheme }
            ].map(({ value, icon: Icon, label, action }) => (
              <button
                key={value}
                onClick={action}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  (value === 'auto' && !localStorage.getItem('space4u_theme')) || theme === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-medium">Text size</h3>
              <p className="text-sm text-gray-600">Adjust text size for better readability</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">A</span>
            <input
              type="range"
              min="0"
              max="3"
              value={['small', 'medium', 'large', 'extra-large'].indexOf(settings.appearance.textSize)}
              onChange={(e) => {
                const sizes = ['small', 'medium', 'large', 'extra-large']
                updateSetting('appearance', 'textSize', sizes[e.target.value])
              }}
              className="flex-1"
            />
            <span className="text-lg text-gray-600">A</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-medium">Reduce motion</h3>
              <p className="text-sm text-gray-600">Minimize animations for accessibility</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.appearance.reduceMotion}
            onChange={(e) => updateSetting('appearance', 'reduceMotion', e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-medium">Display density</h3>
            </div>
          </div>
          <select
            value={settings.appearance.displayDensity}
            onChange={(e) => updateSetting('appearance', 'displayDensity', e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-medium">Card layout</h3>
            </div>
          </div>
          <select
            value={settings.appearance.cardLayout}
            onChange={(e) => updateSetting('appearance', 'cardLayout', e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-medium">Animation speed</h3>
            </div>
          </div>
          <select
            value={settings.appearance.animationSpeed}
            onChange={(e) => updateSetting('appearance', 'animationSpeed', e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smile className="w-5 h-5 text-pink-500" />
            <div>
              <h3 className="font-medium">Emoji style</h3>
            </div>
          </div>
          <select
            value={settings.appearance.emojiStyle}
            onChange={(e) => updateSetting('appearance', 'emojiStyle', e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="native">Native</option>
            <option value="twitter">Twitter</option>
            <option value="google">Google</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default AppearanceSettings