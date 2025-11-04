import { useState, useEffect } from 'react'
import { Tag, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function TagAnalytics() {
  const [tagData, setTagData] = useState([])
  const [moodFilter, setMoodFilter] = useState('all')

  useEffect(() => {
    const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
    const moodEntries = Object.values(moods)
    
    const tagFrequency = {}
    moodEntries.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => {
          const key = `${tag}_${entry.mood}`
          if (!tagFrequency[key]) {
            tagFrequency[key] = { tag, mood: entry.mood, count: 0 }
          }
          tagFrequency[key].count++
        })
      }
    })

    const data = Object.values(tagFrequency)
      .filter(item => moodFilter === 'all' || item.mood === parseInt(moodFilter))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    setTagData(data)
  }, [moodFilter])

  const moodEmojis = ['', '', '', '', '']

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Tag Frequency Analysis</h3>
          <select
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-gray-200 rounded-xl text-sm"
          >
            <option value="all">All Moods</option>
            {[1,2,3,4,5].map(m => (
              <option key={m} value={m}>{moodEmojis[m-1]} Mood {m}</option>
            ))}
          </select>
        </div>

        {tagData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tagData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tag" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <Tag size={48} className="mx-auto mb-3 opacity-50" />
            <p>No tag data available</p>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Top Tags</h3>
        <div className="space-y-2">
          {tagData.slice(0, 5).map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{moodEmojis[item.mood - 1]}</span>
                <span className="font-medium text-text-primary">{item.tag}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">{item.count} times</span>
                <TrendingUp size={16} className="text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TagAnalytics

