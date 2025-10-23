import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Target, Award } from 'lucide-react'
import { useMoods } from '../../hooks/useMoods'

const MotionDiv = motion.div

const moodLabels = {
  5: { label: 'Amazing', emoji: '😊', color: '#10B981' },
  4: { label: 'Good', emoji: '🙂', color: '#84CC16' },
  3: { label: 'Okay', emoji: '😐', color: '#F59E0B' },
  2: { label: 'Low', emoji: '😢', color: '#F97316' },
  1: { label: 'Struggling', emoji: '😰', color: '#EF4444' }
}

function EnhancedMoodTrends() {
  const [period, setPeriod] = useState('7')
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState(null)
  const [chartType, setChartType] = useState('area')
  const { moods, loading: moodsLoading } = useMoods()

  useEffect(() => {
    if (!moodsLoading) {
      loadMoodData()
    }
  }, [period, moods, moodsLoading])

  const loadMoodData = () => {
    const moodEntries = Object.entries(moods || {})
      .map(([date, mood]) => ({
        date,
        mood: mood.mood,
        emoji: mood.emoji,
        label: mood.label,
        note: mood.note,
        timestamp: mood.timestamp
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

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
  }

  const calculateStats = (currentData, allData) => {
    if (currentData.length === 0) {
      setStats(null)
      return
    }

    const currentAvg = currentData.reduce((sum, entry) => sum + entry.mood, 0) / currentData.length
    
    const prevPeriodData = period === 'all' ? [] : allData.slice(-(parseInt(period) * 2), -parseInt(period))
    const prevAvg = prevPeriodData.length > 0 
      ? prevPeriodData.reduce((sum, entry) => sum + entry.mood, 0) / prevPeriodData.length 
      : currentAvg
    
    const trend = currentAvg - prevAvg
    const bestDay = currentData.reduce((best, entry) => 
      entry.mood > best.mood ? entry : best
    )

    const moodCounts = currentData.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1
      return counts
    }, {})
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    )

    const goodDays = currentData.filter(entry => entry.mood >= 4).length
    const goodDaysPercent = Math.round((goodDays / currentData.length) * 100)

    setStats({
      average: currentAvg,
      trend,
      bestDay,
      mostCommonMood: parseInt(mostCommonMood),
      goodDaysPercent,
      totalEntries: currentData.length
    })
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-xl shadow-lg border"
        >
          <p className="font-medium text-sm">
            {new Date(data.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-lg my-1">{data.emoji} {data.label}</p>
          {data.note && (
            <p className="text-xs text-gray-600 max-w-xs line-clamp-2">
              {data.note}
            </p>
          )}
        </MotionDiv>
      )
    }
    return null
  }

  if (moodsLoading) {
    return (
      <div className="card p-6 mb-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (chartData.length < 3) {
    return (
      <MotionDiv
        className="card p-6 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-4xl mb-4">📈</div>
        <h3 className="text-xl font-semibold mb-2">Your Mood Trends</h3>
        <p className="text-gray-600 mb-4">Keep logging to see trends</p>
        <div className="bg-gray-100 rounded-full h-2 mb-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(chartData.length / 3) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">{chartData.length}/3 moods needed</p>
      </MotionDiv>
    )
  }

  return (
    <MotionDiv
      className="card p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between mb-6 flex-wrap gap-2">
        <div>
          <h3 className="text-xl font-semibold">Your Mood Trends</h3>
          <p className="text-sm text-gray-600">
            {period === 'all' ? 'All time' : `Last ${period} days`}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            {['7', '30', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  period === p ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p === 'all' ? 'All' : `${p}d`}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'area' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'bar' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="mb-6 p-4 bg-primary/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{moodLabels[Math.round(stats.average)]?.emoji}</span>
            <span className="text-lg font-semibold">
              Average mood: {stats.average.toFixed(1)}
            </span>
          </div>
          {stats.trend !== 0 && (
            <p className="text-sm text-gray-600">
              {stats.trend > 0 ? '↑' : '↓'} {Math.abs(stats.trend).toFixed(1)} {stats.trend > 0 ? 'better' : 'lower'} than last period
            </p>
          )}
        </div>
      )}

      <div className="h-64 md:h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
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
                tickFormatter={(value) => moodLabels[value]?.emoji || ''}
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
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
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
                tickFormatter={(value) => moodLabels[value]?.emoji || ''}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 16 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="mood"
                fill="#4F46E5"
                radius={[8, 8, 0, 0]}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {stats && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Award className="text-primary" size={20} />
            <div>
              <p className="text-sm font-medium">Best day</p>
              <p className="text-xs text-gray-600">
                {new Date(stats.bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {stats.bestDay.emoji}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Target className="text-primary" size={20} />
            <div>
              <p className="text-sm font-medium">Most common</p>
              <p className="text-xs text-gray-600">
                {moodLabels[stats.mostCommonMood]?.emoji} {moodLabels[stats.mostCommonMood]?.label}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <TrendingUp className="text-primary" size={20} />
            <div>
              <p className="text-sm font-medium">Good days</p>
              <p className="text-xs text-gray-600">{stats.goodDaysPercent}% felt good or better</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Calendar className="text-primary" size={20} />
            <div>
              <p className="text-sm font-medium">Total entries</p>
              <p className="text-xs text-gray-600">{stats.totalEntries} mood logs</p>
            </div>
          </div>
        </div>
      )}
    </MotionDiv>
  )
}

export default EnhancedMoodTrends
