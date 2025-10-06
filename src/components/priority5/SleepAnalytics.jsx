import { useState, useEffect } from 'react'
import { Moon, TrendingUp, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function SleepAnalytics() {
  const [sleepData, setS leepData] = useState([])
  const [stats, setStats] = useState({ avgQuality: 0, avgHours: 0, sleepDebt: 0 })

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('safespace_sleep_logs') || '[]')
    const last30 = logs.slice(-30)

    const chartData = last30.map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      quality: log.quality,
      hours: log.hours
    }))

    const avgQuality = last30.reduce((sum, l) => sum + l.quality, 0) / last30.length || 0
    const avgHours = last30.reduce((sum, l) => sum + l.hours, 0) / last30.length || 0
    const sleepDebt = Math.max(0, (8 - avgHours) * 30)

    setS leepData(chartData)
    setStats({ avgQuality: avgQuality.toFixed(1), avgHours: avgHours.toFixed(1), sleepDebt: sleepDebt.toFixed(1) })
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="text-primary" size={24} />
            <h3 className="font-semibold text-text-primary">Avg Quality</h3>
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.avgQuality}/5</p>
        </div>

        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-primary" size={24} />
            <h3 className="font-semibold text-text-primary">Avg Hours</h3>
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.avgHours}h</p>
        </div>

        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-orange-500" size={24} />
            <h3 className="font-semibold text-text-primary">Sleep Debt</h3>
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.sleepDebt}h</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Sleep Quality Trend</h3>
        {sleepData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="quality" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <Moon size={48} className="mx-auto mb-3 opacity-50" />
            <p>No sleep data available</p>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recommendations</h3>
        <div className="space-y-3">
          {stats.avgHours < 7 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm text-orange-800">
                💤 You're averaging {stats.avgHours} hours. Aim for 7-9 hours for optimal health.
              </p>
            </div>
          )}
          {stats.avgQuality < 3 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                🌙 Your sleep quality is below average. Try establishing a bedtime routine.
              </p>
            </div>
          )}
          {stats.sleepDebt > 10 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">
                ⚠️ High sleep debt detected. Prioritize rest this week.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SleepAnalytics
