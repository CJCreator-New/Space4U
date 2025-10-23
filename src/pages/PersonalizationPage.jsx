import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles, Settings, RotateCcw, Info, CheckCircle, XCircle } from 'lucide-react'
import { getPersonalization, togglePersonalization, resetPersonalization, updatePersonalization } from '../utils/personalizationEngine'
import SafeComponent from '../components/SafeComponent'

function PersonalizationPage() {
  const { t } = useTranslation()
  const [config, setConfig] = useState(getPersonalization())

  const handleToggle = () => {
    const updated = togglePersonalization(!config.enabled)
    setConfig(updated)
  }

  const handleReset = () => {
    if (confirm(t('personalization.resetConfirm'))) {
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
            <h1 className="text-2xl font-bold">{t('personalization.title')}</h1>
          </div>
          <p className="text-text-secondary">{t('personalization.subtitle')}</p>
        </div>

        {/* Enable/Disable */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold mb-1">{t('personalization.intelligentPersonalization')}</h3>
              <p className="text-sm text-text-secondary">{t('personalization.learnPatterns')}</p>
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
                <p className="text-xs text-text-secondary">{t('personalization.featuresTracked')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{recommendationCount}</p>
                <p className="text-xs text-text-secondary">{t('personalization.activeRecommendations')}</p>
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
                {t('personalization.preferences')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('personalization.dashboardLayout')}</label>
                  <select
                    value={config.preferences?.dashboardLayout || 'adaptive'}
                    onChange={(e) => updatePreference('dashboardLayout', e.target.value)}
                    className="input w-full"
                  >
                    <option value="adaptive">{t('personalization.adaptive')}</option>
                    <option value="fixed">{t('personalization.fixed')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('personalization.recommendationFrequency')}</label>
                  <select
                    value={config.preferences?.recommendationFrequency || 'medium'}
                    onChange={(e) => updatePreference('recommendationFrequency', e.target.value)}
                    className="input w-full"
                  >
                    <option value="high">{t('personalization.high')}</option>
                    <option value="medium">{t('personalization.medium')}</option>
                    <option value="low">{t('personalization.low')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('personalization.contextualHelp')}</label>
                  <select
                    value={config.preferences?.helpLevel || 'full'}
                    onChange={(e) => updatePreference('helpLevel', e.target.value)}
                    className="input w-full"
                  >
                    <option value="full">{t('personalization.full')}</option>
                    <option value="minimal">{t('personalization.minimal')}</option>
                    <option value="none">{t('personalization.none')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Info */}
            <div className="card p-6 mb-6 bg-blue-50 border border-blue-200">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-2 text-gray-900">{t('personalization.privacyFirst')}</p>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{t('personalization.localProcessing')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{t('personalization.noDataTransmitted')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{t('personalization.completeControl')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{t('personalization.noTracking')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reset */}
            <button onClick={handleReset} className="btn-secondary w-full flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              {t('personalization.resetPersonalization')}
            </button>
          </>
        )}
      </div>
    </SafeComponent>
  )
}

export default PersonalizationPage
