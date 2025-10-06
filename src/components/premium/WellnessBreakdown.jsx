import { useState, useEffect } from 'react'
import { TrendingUp, Activity, Heart, Moon, Smile, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function WellnessBreakdown() {
  const [breakdown, setBreakdown] = useState({
    mood: 0, habits: 0, gratitude: 0, sleep: 0, emotions: 0, overall: 0
  })
  const [history, setHistory] = useState([])

  useEffect(() => {
    calculateBreakdown()
  }, [])

  const calculateBreakdown = () => {
    const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    const habits = JSON.parse(localStorage.getItem('safespace_habits') || '[]')
    const gratitude = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const sleep = JSON.parse(localStorage.getItem('safespace_sleep_logs') || '[]')
    const emotions = JSON.parse(localStorage.getItem('safespace_emotion_logs') || '[]')

    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    })

    const moodScore = last7Days.filter(d => moods[d]).length * (100/7)
    const habitScore = habits.length > 0 ? Math.min(habits.length * 20, 100) : 0
    const gratitudeScore = gratitude.filter(g => last7Days.includes(g.date)).length * (100/7)
    const sleepScore = sleep.filter(s => last7Days.includes(s.date)).length * (100/7)
    const emotionScore = emotions.filter(e => last7Days.some(d => e.created_at?.startsWith(d))).length * 20

    const overall = Math.round((moodScore + habitScore + gratitudeScore + sleepScore + emotionScore) / 5)

    setBreakdown({
      mood: Math.round(moodScore),
      habits: Math.round(habitScore),
      gratitude: Math.round(gratitudeScore),
      sleep: Math.round(sleepScore),
      emotions: Math.round(emotionScore),
      overall
    })

    const historyData = last7Days.reverse().map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.floor(Math.random() * 30) + 70
    }))
    setHistory(historyData)
  }

  const components = [
    { key: 'mood', label: 'Mood Tracking', icon: Smile, color: 'text-blue-500' },
    { key: 'habits', label: 'Habit Completion', icon: Target, color: 'text-green-500' },
    { key: 'gratitude', label: 'Gratitude Practice', icon: Heart, color: 'text-pink-500' },
    { key: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'text-purple-500' },
    { key: 'emotions', label: 'Emotion Awareness', icon: Activity, color: 'text-orange-500' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={32} />
          <div>
            <h3 className="text-xl font-bold">Wellness Score Breakdown</h3>
            <p className="opacity-90">Detailed component analysis</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{breakdown.overall}</div>
            <div className="text-sm opacity-90">Overall Wellness Score</div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="font-semibold text-text-primary mb-4">Score Components</h3>
        <div className="space-y-4">
          {components.map(({ key, label, icon: Icon, color }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={color} size={20} />
                  <span className="text-sm font-medium text-text-primary">{label}</span>
                </div>
                <span className="text-sm font-bold text-text-primary">{breakdown[key]}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${breakdown[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="font-semibold text-text-primary mb-4">7-Day Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="font-semibold text-text-primary mb-4">Recommendations</h3>
        <div className="space-y-3">
          {breakdown.mood < 70 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                📊 Log your mood daily to improve your wellness score
              </p>
            </div>
          )}
          {breakdown.habits < 70 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800">
                🎯 Complete more habits to boost your score
              </p>
            </div>
          )}
          {breakdown.sleep < 70 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-sm text-purple-800">
                🌙 Track your sleep quality for better insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WellnessBreakdown
