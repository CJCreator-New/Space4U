import { useState, useEffect } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, Calendar, Target, Award } from 'lucide-react'
import { useMoods } from '../hooks/useMoods'

const moodLabels = {
  5: { label: 'Amazing', emoji: '😊' },
  4: { label: 'Good', emoji: '🙂' },
  3: { label: 'Okay', emoji: '😐' },
  2: { label: 'Low', emoji: '😢' },
  1: { label: 'Struggling', emoji: '😰' }
}

function MoodTrends() {
  const [period, setPeriod] = useState('7')
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState(null)
  const { moods, loading: moodsLoading } = useMoods()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!moodsLoading) {
      loadMoodData()
    }
  }, [period, moods, moodsLoading])

  const loadMoodData = () => {
    const moodEntries = Object.entries(moods || {}).map(([date, mood]) => ({
      date,
      mood: mood.mood,
      emoji: mood.emoji,
      label: mood.label,
      note: mood.note,
      timestamp: mood.timestamp
    })).sort((a, b) => new Date(a.date) - new Date(b.date))

    const days = period === 'all' ? moodEntries.length : parseInt(period)
    const filteredData = period === 'all' ? moodEntries : moodEntries.slice(-days)
    
    const processedData = filteredData.map(entry => ({
      ...entry,
      displayDate: new Date(entry.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }))

    setChartData(processedData)
    calculateStats(processedData, moodEntries)
    setLoading(false)
  }

  const calculateStats = (currentData, allData) => {
    if (currentData.length === 0) {
      setStats(null)
      return
    }

    const currentAvg = currentData.reduce((sum, entry) => sum + entry.mood, 0) / currentData.length
    
    // Previous period comparison
    const prevPeriodData = period === 'all' ? [] : allData.slice(-(parseInt(period) * 2), -parseInt(period))
    const prevAvg = prevPeriodData.length > 0 
      ? prevPeriodData.reduce((sum, entry) => sum + entry.mood, 0) / prevPeriodData.length 
      : currentAvg
    
    const trend = currentAvg - prevAvg

    // Best day
    const bestDay = currentData.reduce((best, entry) => 
      entry.mood > best.mood ? entry : best
    )

    // Most common mood
    const moodCounts = currentData.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1
      return counts
    }, {})
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    )

    // Good days percentage
    const goodDays = currentData.filter(entry => entry.mood >= 4).length
    const goodDaysPercent = Math.round((goodDays / currentData.length) * 100)

    // Most consistent day of week
    const dayOfWeekMoods = currentData.reduce((days, entry) => {
      const dayOfWeek = new Date(entry.date).getDay()
      if (!days[dayOfWeek]) days[dayOfWeek] = []
      days[dayOfWeek].push(entry.mood)
      return days
    }, {})

    const dayVariances = Object.entries(dayOfWeekMoods).map(([day, moods]) => {
      const avg = moods.reduce((sum, mood) => sum + mood, 0) / moods.length
      const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - avg, 2), 0) / moods.length
      return { day: parseInt(day), variance }
    })

    const mostConsistentDay = dayVariances.length > 0 
      ? dayVariances.reduce((min, curr) => curr.variance < min.variance ? curr : min)
      : null

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    setStats({
      average: currentAvg,
      trend,
      bestDay,
      mostCommonMood: parseInt(mostCommonMood),
      goodDaysPercent,
      mostConsistentDay: mostConsistentDay ? dayNames[mostConsistentDay.day] : null
    })
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-surface dark:bg-gray-700 p-3 rounded-xl shadow-lg border dark:border-gray-600">
          <p className="font-medium">{new Date(data.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p className="text-lg">{data.emoji} {data.label}</p>
          {data.note && (
            <p className="text-sm text-text-secondary mt-1 max-w-xs">
              {data.note.length > 50 ? `${data.note.slice(0, 50)}...` : data.note}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const formatYAxisLabel = (value) => {
    return moodLabels[value]?.emoji || ''
  }

  if (loading) {
    return (
      <div className="card p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    )
  }

  if (chartData.length < 3) {
    return (
      <div className="card p-6 mb-6 text-center dark:bg-gray-800 dark:border-gray-700">
        <div className="text-4xl mb-4">📈</div>
        <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-2">Your Mood Trends</h3>
        <p className="text-text-secondary dark:text-gray-300 mb-4">Keep logging to see trends</p>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-primary dark:bg-primary-light h-2 rounded-full transition-all duration-300"
            style={{ width: `${(chartData.length / 3) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-text-secondary dark:text-gray-300">{chartData.length}/3 moods needed</p>
      </div>
    )
  }

  const periodLabels = {
    '7': 'Last 7 days',
    '30': 'Last 30 days',
    'all': 'All time'
  }

  return (
    <div className="card p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-text-primary dark:text-white">Your Mood Trends</h3>
          <p className="text-text-secondary dark:text-gray-300 text-sm">{periodLabels[period]}</p>
        </div>
        <div className="flex gap-2">
          {['7', '30', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                period === p ? 'bg-primary dark:bg-primary-light text-white' : 'text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white'
              }`}
            >
              {p === 'all' ? 'All time' : `${p} days`}
            </button>
          ))}
        </div>
      </div>

      {stats && (
        <div className="mb-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{moodLabels[Math.round(stats.average)]?.emoji}</span>
            <span className="text-lg font-semibold">
              Your average mood: {stats.average.toFixed(1)}
            </span>
          </div>
          {stats.trend !== 0 && (
            <p className="text-sm text-text-secondary">
              {stats.trend > 0 ? '↑' : '↓'} {Math.abs(stats.trend).toFixed(1)} {stats.trend > 0 ? 'better' : 'lower'} than last period
            </p>
          )}
        </div>
      )}

      <div className="h-64 md:h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={formatYAxisLabel}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 16 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#4F46E5"
              strokeWidth={3}
              fill="url(#moodGradient)"
              dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {stats && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Award className="text-primary dark:text-primary-light" size={20} />
            <div>
              <p className="text-sm font-medium dark:text-white">Best day</p>
              <p className="text-xs text-text-secondary dark:text-gray-300">
                {new Date(stats.bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {stats.bestDay.emoji}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Target className="text-primary dark:text-primary-light" size={20} />
            <div>
              <p className="text-sm font-medium dark:text-white">Most common mood</p>
              <p className="text-xs text-text-secondary dark:text-gray-300">
                {moodLabels[stats.mostCommonMood]?.emoji} {moodLabels[stats.mostCommonMood]?.label}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <TrendingUp className="text-primary dark:text-primary-light" size={20} />
            <div>
              <p className="text-sm font-medium dark:text-white">Good days</p>
              <p className="text-xs text-text-secondary dark:text-gray-300">{stats.goodDaysPercent}% felt good or better</p>
            </div>
          </div>
          
          {stats.mostConsistentDay && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Calendar className="text-primary dark:text-primary-light" size={20} />
              <div>
                <p className="text-sm font-medium dark:text-white">Most consistent</p>
                <p className="text-xs text-text-secondary dark:text-gray-300">{stats.mostConsistentDay}s</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MoodTrends