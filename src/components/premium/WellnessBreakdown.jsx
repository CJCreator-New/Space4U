import { TrendingUp, Activity, Heart, Brain, Moon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function WellnessBreakdown() {
  const metrics = [
    { name: 'Mood', score: 78, icon: Heart, color: 'text-pink-500' },
    { name: 'Sleep', score: 65, icon: Moon, color: 'text-blue-500' },
    { name: 'Activity', score: 82, icon: Activity, color: 'text-green-500' },
    { name: 'Mental', score: 71, icon: Brain, color: 'text-purple-500' }
  ]

  const weeklyData = [
    { day: 'Mon', score: 72 },
    { day: 'Tue', score: 68 },
    { day: 'Wed', score: 75 },
    { day: 'Thu', score: 71 },
    { day: 'Fri', score: 78 },
    { day: 'Sat', score: 82 },
    { day: 'Sun', score: 74 }
  ]

  const overallScore = Math.round(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length)

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white">
        <TrendingUp className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Wellness Breakdown</h2>
        <p className="opacity-90">Detailed analytics across all wellness dimensions</p>
      </div>

      <div className="card p-6">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-primary mb-2">{overallScore}</div>
          <p className="text-text-secondary">Overall Wellness Score</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map(metric => {
            const Icon = metric.icon
            return (
              <div key={metric.name} className="p-4 bg-hover rounded-xl">
                <Icon className={`w-8 h-8 ${metric.color} mb-2`} />
                <p className="text-sm text-text-secondary">{metric.name}</p>
                <p className="text-2xl font-bold">{metric.score}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold mb-4">Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-6 bg-green-50">
        <h3 className="font-bold mb-2">Insights</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Your activity levels are excellent this week</li>
          <li>• Consider improving sleep quality for better mood</li>
          <li>• Mental wellness shows steady improvement</li>
          <li>• Weekend scores are consistently higher</li>
        </ul>
      </div>
    </div>
  )
}

export default WellnessBreakdown
