import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function GratitudeStats({ entries }) {
  if (entries.length === 0) return null

  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const chartData = last7Days.map(date => {
    const entry = entries.find(e => e.date === date)
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: entry?.mood_rating || 0
    }
  })

  const avgMood = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.mood_rating, 0) / entries.length).toFixed(1)
    : 0

  return (
    <div className="card p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Weekly Mood Trend</h3>
      <div className="mb-4">
        <p className="text-text-secondary text-sm">Average Mood: <span className="text-primary font-bold text-lg">{avgMood}/5</span></p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" stroke="#888" />
          <YAxis domain={[0, 5]} stroke="#888" />
          <Tooltip />
          <Bar dataKey="mood" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GratitudeStats
