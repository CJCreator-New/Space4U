import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Crown, Sparkles, Smile, Heart, BookOpen } from 'lucide-react'
import MoodTracker from '../components/MoodTracker'
import MoodCalendar from '../components/MoodCalendar'
import MoodTrends from '../components/MoodTrends'
import SafeComponent from '../components/SafeComponent'
import AdaptiveDashboard from '../components/personalization/AdaptiveDashboard'
import FABMenu from '../components/common/FABMenu'
import MicroInteraction from '../components/common/MicroInteraction'
import { getPremiumStatus } from '../utils/premiumUtils'
import { initPersonalization } from '../utils/personalizationEngine'
import { trackFeatureUsage } from '../utils/usageTracker'

function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState(null)
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const { isPremium, trialActive, daysLeft } = getPremiumStatus()

  useEffect(() => {
    try {
      const userData = localStorage.getItem('safespace_user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
      initPersonalization()
      trackFeatureUsage('home', 0)
    } catch (err) {
      console.error('Error loading user data:', err)
      setError(t('errors.failedToLoad'))
    }
  }, [])

  const handleMoodLogged = () => {
    try {
      setRefreshKey(prev => prev + 1)
      setShowMoodTracker(false)
    } catch (err) {
      console.error('Error refreshing mood data:', err)
    }
  }

  const fabActions = [
    {
      icon: <Smile size={20} />,
      label: t('mood.logMood'),
      onClick: () => setShowMoodTracker(true),
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: <Heart size={20} />,
      label: t('gratitude.title'),
      onClick: () => navigate('/gratitude'),
      color: 'from-pink-500 to-red-600'
    },
    {
      icon: <BookOpen size={20} />,
      label: t('home.journal'),
      onClick: () => navigate('/advanced-tools'),
      color: 'from-blue-500 to-cyan-600'
    }
  ]

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t('errors.reloadPage')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 mb-6 shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.avatar && (
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white/30 shadow-lg relative">
                {user.avatar}
                {isPremium && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Crown size={14} className="text-white" />
                  </div>
                )}
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {t('welcome.back')}{user?.username ? `, ${user.username}` : ''}! 👋
              </h1>
              <p className="text-white/90 text-lg mt-1">{t('home.subtitle')}</p>
            </div>
          </div>
          {isPremium && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Crown size={18} className="text-yellow-300" />
              <span className="text-white font-medium">
                {trialActive ? t('premium.trialDaysLeft', { days: daysLeft }) : t('premium.title')}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {!isPremium && (
        <Link to="/premium" className="block mb-6">
          <div className="card p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Crown className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('premium.upgrade')}</h3>
                  <p className="text-sm text-gray-700">{t('premium.unlockUnlimited')}</p>
                </div>
              </div>
              <Sparkles className="text-yellow-500" size={24} />
            </div>
          </div>
        </Link>
      )}
      
      {/* Mood Tracking Section - Wrapped in SafeComponent */}
      {showMoodTracker && (
        <SafeComponent>
          <div className="mb-6">
            <MoodTracker onMoodLogged={handleMoodLogged} />
          </div>
        </SafeComponent>
      )}
      
      <SafeComponent>
        <div className="mb-6">
          <MoodCalendar key={refreshKey} />
        </div>
      </SafeComponent>
      
      <SafeComponent>
        <div className="mb-6">
          <MoodTrends key={refreshKey} />
        </div>
      </SafeComponent>

      <SafeComponent>
        <div className="mb-6">
          <AdaptiveDashboard />
        </div>
      </SafeComponent>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{t('home.quickActions')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MicroInteraction type="lift">
            <Link to="/gratitude" className="card p-6 hover:shadow-xl transition-all duration-300 group block">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">❤️</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.gratitude')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.gratitudeDesc')}</p>
            </Link>
          </MicroInteraction>
          
          <MicroInteraction type="lift">
            <Link to="/habits" className="card p-6 hover:shadow-xl transition-all duration-300 group block">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.habits')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.habitsDesc')}</p>
            </Link>
          </MicroInteraction>
          
          <MicroInteraction type="lift">
            <Link to="/emotions" className="card p-6 hover:shadow-xl transition-all duration-300 group block">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">💭</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.emotions')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.emotionsDesc')}</p>
            </Link>
          </MicroInteraction>
          
          <Link to="/coping-skills" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🛠️</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.copingSkills')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.copingSkillsDesc')}</p>
          </Link>
          
          <Link to="/reminders" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⏰</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.reminders')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.remindersDesc')}</p>
          </Link>
          
          <Link to="/tools" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🧰</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.therapyTools')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.therapyToolsDesc')}</p>
          </Link>
          
          <Link to="/wellness" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📊</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.wellnessScore')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.wellnessScoreDesc')}</p>
          </Link>
          
          <Link to="/advanced-tools" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🚀</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.advancedTools')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.advancedToolsDesc')}</p>
          </Link>
          
          <Link to="/gamification" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏆</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.gamification')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.gamificationDesc')}</p>
          </Link>
          
          <Link to="/wellness-plan" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📅</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.wellnessPlan')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.wellnessPlanDesc')}</p>
          </Link>
          
          <Link to="/social" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🤝</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.socialHub')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.socialHubDesc')}</p>
          </Link>
          
          <Link to="/analytics" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📊</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.analytics')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.analyticsDesc')}</p>
          </Link>
          
          <Link to="/professional" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏥</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.professional')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.professionalDesc')}</p>
          </Link>
          
          <Link to="/technical" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📡</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.technical')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.technicalDesc')}</p>
          </Link>
          
          <Link to="/premium/features" className="card p-6 hover:shadow-xl transition-all duration-300 group border-2 border-yellow-400">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👑</span>
              <h3 className="text-lg font-semibold">{t('wellnessTools.premiumFeatures')}</h3>
            </div>
            <p className="text-text-secondary text-sm">{t('wellnessTools.premiumFeaturesDesc')}</p>
          </Link>
        </div>
      </div>

      {/* FAB Menu for Quick Actions */}
      <FABMenu actions={fabActions} />
    </div>
  )
}

export default HomePage