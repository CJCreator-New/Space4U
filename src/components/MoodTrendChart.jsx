import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { motion } from 'framer-motion'

const moodEmojis = { 5: '😊', 4: '🙂', 3: '😐', 2: '😔', 1: '😢' }

function MoodTrendChart({ moods }) {
  // Memoize the data transformation to prevent re-computation on every render
  const last7Days = useMemo(() => {
    if (!moods || moods.length < 3) return []
    return moods.slice(-7).map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: m.mood,
      emoji: moodEmojis[m.mood],
      note: m.note
    }))
  }, [moods])

  if (!moods || moods.length < 3) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <h3 className="font-semibold text-text-primary mb-2">Not enough data yet</h3>
        <p className="text-sm text-text-secondary">Log at least 3 moods to see your trend chart</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <div className="text-2xl mb-1">{data.emoji}</div>
          <div className="font-semibold text-text-primary">{data.date}</div>
          <div className="text-sm text-text-secondary">Mood: {data.mood}/5</div>
          {data.note && <div className="text-xs text-text-secondary mt-1 max-w-xs">"{data.note.slice(0, 50)}..."</div>}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="card p-6"
    >
      <h3 className="font-semibold text-text-primary mb-4">7-Day Mood Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={last7Days}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            stroke="#E5E7EB"
          />
          <YAxis 
            domain={[0, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            stroke="#E5E7EB"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="mood" 
            stroke="#4F46E5" 
            strokeWidth={3}
            fill="url(#moodGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default MoodTrendChart
