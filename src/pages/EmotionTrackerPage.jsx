import { useState, useEffect } from 'react'
import { Plus, Heart, Crown, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SafeComponent from '../components/SafeComponent'
import PremiumPaywall from '../components/PremiumPaywall'
import { getPremiumStatus } from '../utils/premiumUtils'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import ResearchCard from '../components/wellness/ResearchCard'
import { disclaimers } from '../data/disclaimers'
import { researchCitations } from '../data/researchCitations'

const EMOTIONS = {
  joy: { color: 'yellow', secondary: ['Optimistic', 'Proud', 'Content', 'Playful'] },
  trust: { color: 'green', secondary: ['Accepting', 'Confident', 'Secure'] },
  fear: { color: 'purple', secondary: ['Anxious', 'Worried', 'Scared', 'Nervous'] },
  surprise: { color: 'blue', secondary: ['Amazed', 'Confused', 'Startled'] },
  sadness: { color: 'indigo', secondary: ['Lonely', 'Disappointed', 'Hurt', 'Depressed'] },
  disgust: { color: 'pink', secondary: ['Disapproving', 'Uncomfortable', 'Repulsed'] },
  anger: { color: 'red', secondary: ['Frustrated', 'Irritated', 'Furious', 'Resentful'] },
  anticipation: { color: 'orange', secondary: ['Hopeful', 'Excited', 'Eager'] }
}

function EmotionTrackerPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [logs, setLogs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [entry, setEntry] = useState({ primary_emotion: '', secondary_emotions: [], intensity: 5, trigger: '' })
  const { isPremium } = getPremiumStatus()

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('space4u_emotion_logs') || '[]')
    setLogs(saved)
  }, [])

  const saveEntry = () => {
    const newEntry = { ...entry, id: Date.now(), created_at: new Date().toISOString() }
    const updated = [newEntry, ...logs]
    localStorage.setItem('space4u_emotion_logs', JSON.stringify(updated))
    setLogs(updated)
    setShowModal(false)
    setEntry({ primary_emotion: '', secondary_emotions: [], intensity: 5, trigger: '' })
  }

  return (
    <SafeComponent>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{t('emotions.title')}</h1>
            {isPremium && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
                <Crown size={12} />
                {t('common.premium')}
              </div>
            )}
          </div>
          <p className="text-text-secondary">{t('emotions.subtitle')}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" /> {t('emotions.logEmotion')}
        </button>
      </div>

      <div className="mb-6">
        <DisclaimerBanner disclaimer={disclaimers.emotions} />
      </div>

      <div className="mb-6">
        <ResearchCard citations={researchCitations.emotions} title="Why Naming Emotions Helps" />
      </div>

      {isPremium && logs.length > 0 && (
        <div className="card p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">{t('emotions.analytics.title')}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{logs.length}</div>
              <div className="text-sm text-gray-600">{t('emotions.analytics.totalLogs')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + l.intensity, 0) / logs.length) : 0}
              </div>
              <div className="text-sm text-gray-600">{t('emotions.analytics.avgIntensity')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 capitalize">
                {logs.length > 0 ? logs.reduce((acc, l) => {
                  acc[l.primary_emotion] = (acc[l.primary_emotion] || 0) + 1
                  return acc
                }, {})[Object.keys(logs.reduce((acc, l) => {
                  acc[l.primary_emotion] = (acc[l.primary_emotion] || 0) + 1
                  return acc
                }, {})).reduce((a, b) => logs.reduce((acc, l) => {
                  acc[l.primary_emotion] = (acc[l.primary_emotion] || 0) + 1
                  return acc
                }, {})[a] > logs.reduce((acc, l) => {
                  acc[l.primary_emotion] = (acc[l.primary_emotion] || 0) + 1
                  return acc
                }, {})[b] ? a : b)] && Object.keys(logs.reduce((acc, l) => {
                  acc[l.primary_emotion] = (acc[l.primary_emotion] || 0) + 1
                  return acc
                }, {})).reduce((a, b) => logs.reduce((acc, l) => {
                  acc[l.primary_emotion] = (acc[l.primary_emotion] || 0) + 1
                  return acc
                }, {})[a] > logs.reduce((acc, l) => {
                  acc[l.primary_emotion] = (acc[l.primary_emotion] || 0) + 1
                  return acc
                }, {})[b] ? a : b) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">{t('emotions.analytics.mostCommon')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {logs.filter(l => new Date(l.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length}
              </div>
              <div className="text-sm text-gray-600">{t('emotions.analytics.thisWeek')}</div>
            </div>
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">{t('emotions.empty.title')}</h3>
          <p className="text-text-secondary mb-4">{t('emotions.empty.description')}</p>
          <div className="max-w-md mx-auto mb-6 text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">{t('emotions.empty.benefitsTitle')}</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {t('emotions.empty.benefit1')}</li>
              <li>• {t('emotions.empty.benefit2')}</li>
              <li>• {t('emotions.empty.benefit3')}</li>
              <li>• {t('emotions.empty.benefit4')}</li>
            </ul>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" /> {t('emotions.logFirst')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {(isPremium ? logs : logs.slice(0, 30)).map(log => (
            <div key={log.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold capitalize">{log.primary_emotion}</h3>
                  <p className="text-text-secondary text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-lg font-bold">{t('emotions.intensityLabel', { value: log.intensity })}</span>
              </div>
              {log.secondary_emotions.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {log.secondary_emotions.map((e, i) => (
                    <span key={i} className="px-3 py-1 bg-hover rounded-full text-sm">{e}</span>
                  ))}
                </div>
              )}
              {log.trigger && <p className="text-text-secondary">{t('emotions.triggerLabel', { trigger: log.trigger })}</p>}
            </div>
          ))}
          {!isPremium && logs.length > 30 && (
            <PremiumPaywall
              feature={t('emotions.premium.feature')}
              description={t('emotions.premium.description')}
            >
              <div className="h-40" />
            </PremiumPaywall>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{t('emotions.modal.title')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('emotions.modal.primaryLabel')}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.keys(EMOTIONS).map(emotion => (
                    <button
                      key={emotion}
                      onClick={() => setEntry({ ...entry, primary_emotion: emotion, secondary_emotions: [] })}
                      className={`p-3 rounded-xl capitalize font-medium ${
                        entry.primary_emotion === emotion ? 'bg-primary text-white' : 'bg-hover'
                      }`}
                    >
                      {t(`emotions.primary.${emotion}`)}
                    </button>
                  ))}
                </div>
              </div>

              {entry.primary_emotion && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t('emotions.modal.secondaryLabel')}</label>
                  <div className="flex gap-2 flex-wrap">
                    {EMOTIONS[entry.primary_emotion].secondary.map(sec => (
                      <button
                        key={sec}
                        onClick={() => {
                          const updated = entry.secondary_emotions.includes(sec)
                            ? entry.secondary_emotions.filter(e => e !== sec)
                            : [...entry.secondary_emotions, sec]
                          setEntry({ ...entry, secondary_emotions: updated })
                        }}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          entry.secondary_emotions.includes(sec) ? 'bg-primary text-white' : 'bg-hover'
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{t('emotions.modal.intensityLabel')}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={entry.intensity}
                  onChange={(e) => setEntry({ ...entry, intensity: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-2xl font-bold">{entry.intensity}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('emotions.modal.triggerLabel')}</label>
                <textarea
                  value={entry.trigger}
                  onChange={(e) => setEntry({ ...entry, trigger: e.target.value })}
                  className="input w-full h-24"
                  placeholder={t('emotions.modal.triggerPlaceholder')}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={saveEntry} disabled={!entry.primary_emotion} className="btn-primary flex-1">{t('common.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  
    </SafeComponent>
  )
}

export default EmotionTrackerPage

