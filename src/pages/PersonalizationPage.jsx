import { useState } from 'react'
import { Sparkles, Settings, RotateCcw, Info, CheckCircle, XCircle } from 'lucide-react'
import { getPersonalization, togglePersonalization, resetPersonalization, updatePersonalization } from '../utils/personalizationEngine'
import SafeComponent from '../components/SafeComponent'

function PersonalizationPage() {
  const [config, setConfig] = useState(getPersonalization())

  const handleToggle = () => {
    const updated = togglePersonalization(!config.enabled)
    setConfig(updated)
  }

  const handleReset = () => {
    if (confirm('Reset all personalization? Your core data will be kept.')) {
      const updated = resetPersonalization()
      setConfig(updated)
    }
  }

  const updatePreference = (key, value) => {
    const updated = updatePersonalization({
      preferences: { ...config.preferences, [key]: value }
    })
    setConfig(updated)
  }

  const usageCount = Object.keys(config.usage?.features || {}).length
  const recommendationCount = config.recommendations?.current?.length || 0

  return (
    <SafeComponent>
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Personalization</h1>
          </div>
          <p className="text-text-secondary">Control how Space4U adapts to your needs</p>
        </div>

        {/* Enable/Disable */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold mb-1">Intelligent Personalization</h3>
              <p className="text-sm text-text-secondary">Let Space4U learn your patterns and adapt to you</p>
            </div>
            <button
              onClick={handleToggle}
              className={`w-14 h-8 rounded-full transition-colors ${
                config.enabled ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                config.enabled ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          {config.enabled && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{usageCount}</p>
                <p className="text-xs text-text-secondary">Features Tracked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{recommendationCount}</p>
                <p className="text-xs text-text-secondary">Active Recommendations</p>
              </div>
            </div>
          )}
        </div>

        {/* Preferences */}
        {config.enabled && (
          <>
            <div className="card p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferences
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dashboard Layout</label>
                  <select
                    value={config.preferences?.dashboardLayout || 'adaptive'}
                    onChange={(e) => updatePreference('dashboardLayout', e.target.value)}
                    className="input w-full"
                  >
                    <option value="adaptive">Adaptive (Recommended)</option>
                    <option value="fixed">Fixed Layout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Recommendation Frequency</label>
                  <select
                    value={config.preferences?.recommendationFrequency || 'medium'}
                    onChange={(e) => updatePreference('recommendationFrequency', e.target.value)}
                    className="input w-full"
                  >
                    <option value="high">High (More suggestions)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="low">Low (Fewer suggestions)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contextual Help</label>
                  <select
                    value={config.preferences?.helpLevel || 'full'}
                    onChange={(e) => updatePreference('helpLevel', e.target.value)}
                    className="input w-full"
                  >
                    <option value="full">Full (All tooltips and guides)</option>
                    <option value="minimal">Minimal (Essential only)</option>
                    <option value="none">None (No help prompts)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Info */}
            <div className="card p-6 mb-6 bg-blue-50 border border-blue-200">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-2 text-gray-900">Privacy-First Personalization</p>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>All processing happens locally on your device</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>No data transmitted to external servers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Complete control over your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No tracking or analytics sent anywhere</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reset */}
            <button onClick={handleReset} className="btn-secondary w-full flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Reset Personalization
            </button>
          </>
        )}
      </div>
    </SafeComponent>
  )
}

export default PersonalizationPage
