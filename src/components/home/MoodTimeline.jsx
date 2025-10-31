import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function MoodTimeline() {
  const data = useMemo(() => {
    const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
    const entries = Object.entries(moods)
      .map(([date, mood]) => ({
        date,
        mood: mood.mood || mood.value || 3,
        emoji: mood.emoji
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7)

    return entries.map(entry => ({
      ...entry,
      displayDate: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })
    }))
  }, [])

  if (data.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">ðŸ“Š</div>
        <h3 className="font-semibold text-gray-900 mb-2">Your Mood Timeline</h3>
        <p className="text-gray-600 text-sm">
          Log your mood daily to see trends and patterns over time
        </p>
      </div>
    )
  }

  const trend = data.length > 1 ? data[data.length - 1].mood - data[0].mood : 0
  const avgMood = data.reduce((sum, d) => sum + d.mood, 0) / data.length

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Last 7 Days</h3>
        <div className="flex items-center gap-2 text-sm">
          {trend > 0.5 ? (
            <>
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-600 font-medium">Improving</span>
            </>
          ) : trend < -0.5 ? (
            <>
              <TrendingDown size={16} className="text-orange-500" />
              <span className="text-orange-600 font-medium">Declining</span>
            </>
          ) : (
            <>
              <Minus size={16} className="text-gray-400" />
              <span className="text-gray-600 font-medium">Stable</span>
            </>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis 
            dataKey="displayDate" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.[0]) {
                return (
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                    <div className="text-2xl mb-1">{payload[0].payload.emoji}</div>
                    <div className="text-sm font-medium">{payload[0].payload.displayDate}</div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="#6366f1" 
            strokeWidth={3}
            dot={{ fill: '#6366f1', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Average Mood</span>
          <span className="font-semibold text-gray-900">{avgMood.toFixed(1)}/5</span>
        </div>
      </div>
    </div>
  )
}

