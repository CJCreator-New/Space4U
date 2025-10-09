import { useState, useEffect } from 'react'
import { TrendingUp, Heart, Target, Brain, Smile, Crown } from 'lucide-react'
import SafeComponent from '../components/SafeComponent'
import PremiumPaywall from '../components/PremiumPaywall'
import WellnessBreakdown from '../components/premium/WellnessBreakdown'
import { getPremiumStatus } from '../utils/premiumUtils'

function WellnessDashboardPage() {
  const [score, setScore] = useState(0)
  const [metrics, setMetrics] = useState({
    mood: 0,
    habits: 0,
    gratitude: 0,
    sleep: 0,
    emotions: 0
  })
  const { isPremium } = getPremiumStatus()

  useEffect(() => {
    calculateWellnessScore()
  }, [])

  const calculateWellnessScore = () => {
    const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    const habits = JSON.parse(localStorage.getItem('safespace_habits') || '[]')
    const gratitude = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const sleep = JSON.parse(localStorage.getItem('safespace_sleep_logs') || '[]')
    const emotions = JSON.parse(localStorage.getItem('safespace_emotion_logs') || '[]')

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    })

    // Mood score (0-20)
    const recentMoods = Object.entries(moods).filter(([date]) => last7Days.includes(date))
    const moodScore = recentMoods.length > 0
      ? (recentMoods.reduce((sum, [, mood]) => sum + mood, 0) / recentMoods.length) * 4
      : 0

    // Habit score (0-20)
    const habitCompletions = habits.reduce((sum, h) => {
      return sum + last7Days.filter(d => h.completions?.[d]).length
    }, 0)
    const habitScore = habits.length > 0 ? Math.min((habitCompletions / (habits.length * 7)) * 20, 20) : 0

    // Gratitude score (0-20)
    const gratitudeScore = Math.min((gratitude.filter(g => last7Days.includes(g.date)).length / 7) * 20, 20)

    // Sleep score (0-20)
    const recentSleep = sleep.filter(s => last7Days.includes(s.date))
    const sleepScore = recentSleep.length > 0
      ? (recentSleep.reduce((sum, s) => sum + s.sleep_quality, 0) / recentSleep.length) * 4
      : 0

    // Emotion tracking score (0-20)
    const emotionScore = Math.min((emotions.filter(e => {
      const date = new Date(e.created_at).toISOString().split('T')[0]
      return last7Days.includes(date)
    }).length / 7) * 20, 20)

    const totalScore = Math.round(moodScore + habitScore + gratitudeScore + sleepScore + emotionScore)

    setMetrics({
      mood: Math.round(moodScore),
      habits: Math.round(habitScore),
      gratitude: Math.round(gratitudeScore),
      sleep: Math.round(sleepScore),
      emotions: Math.round(emotionScore)
    })
    setScore(totalScore)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-blue-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Attention'
  }

  return (
    <SafeComponent>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Wellness Dashboard</h1>
          {isPremium && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
              <Crown size={12} />
              Premium
            </div>
          )}
        </div>
        <p className="text-text-secondary">Your comprehensive mental health overview</p>
      </div>

      <div className="card p-8 mb-8 text-center">
        <h2 className="text-lg font-medium text-text-secondary mb-2">Overall Wellness Score</h2>
        <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>{score}/100</div>
        <p className="text-xl font-medium">{getScoreLabel(score)}</p>
      </div>

      {isPremium ? (
        <div className="mb-8">
          <WellnessBreakdown />
        </div>
      ) : (
        <div className="mb-8">
          <PremiumPaywall
            feature="Detailed Wellness Breakdown"
            description="Unlock comprehensive wellness analytics with 7-day trends, component breakdowns, and personalized recommendations."
          >
            <div className="h-96 bg-gray-100 rounded-2xl" />
          </PremiumPaywall>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Smile className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold">Mood Tracking</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{metrics.mood}/20</span>
            <div className="w-32 h-2 bg-hover rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${(metrics.mood / 20) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Habit Completion</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{metrics.habits}/20</span>
            <div className="w-32 h-2 bg-hover rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${(metrics.habits / 20) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <h3 className="text-lg font-semibold">Gratitude Practice</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{metrics.gratitude}/20</span>
            <div className="w-32 h-2 bg-hover rounded-full overflow-hidden">
              <div className="h-full bg-pink-500" style={{ width: `${(metrics.gratitude / 20) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-6 h-6 text-indigo-500" />
            <h3 className="text-lg font-semibold">Emotion Awareness</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{metrics.emotions}/20</span>
            <div className="w-32 h-2 bg-hover rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${(metrics.emotions / 20) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <div className="space-y-3">
          {metrics.mood < 15 && (
            <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg">
              <Smile className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Track your mood daily</p>
                <p className="text-sm text-text-secondary">Regular mood tracking helps identify patterns</p>
              </div>
            </div>
          )}
          {metrics.habits < 15 && (
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
              <Target className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Stay consistent with habits</p>
                <p className="text-sm text-text-secondary">Small daily actions lead to big changes</p>
              </div>
            </div>
          )}
          {metrics.gratitude < 15 && (
            <div className="flex items-start gap-3 p-3 bg-pink-500/10 rounded-lg">
              <Heart className="w-5 h-5 text-pink-500 mt-0.5" />
              <div>
                <p className="font-medium">Practice gratitude</p>
                <p className="text-sm text-text-secondary">Daily gratitude improves overall well-being</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  
    </SafeComponent>
  )
}

export default WellnessDashboardPage
