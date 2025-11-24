import { useMemo } from 'react'
import { TrendingUp, Calendar, BarChart3, PieChart, Target, Heart } from 'lucide-react'
import { GRATITUDE_CATEGORIES } from '../../data/gratitudeCategories'

function GratitudeAnalytics({ entries }) {
  const analytics = useMemo(() => {
    if (!entries.length) return null

    // Basic stats
    const totalEntries = entries.length
    const avgItemsPerEntry = entries.reduce((sum, entry) => sum + (entry.items?.length || 0), 0) / totalEntries
    const avgMoodRating = entries.reduce((sum, entry) => sum + (entry.mood_rating || 3), 0) / totalEntries

    // Category distribution
    const categoryCount = {}
    entries.forEach(entry => {
      if (entry.categories) {
        entry.categories.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })
      }
    })

    // Monthly trends
    const monthlyData = {}
    entries.forEach(entry => {
      const date = new Date(entry.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })

    // Day of week patterns
    const dayOfWeekCount = Array(7).fill(0)
    entries.forEach(entry => {
      const day = new Date(entry.date).getDay()
      dayOfWeekCount[day]++
    })

    // Most common words in gratitude items
    const wordCount = {}
    entries.forEach(entry => {
      if (entry.items) {
        entry.items.forEach(item => {
          const words = item.toLowerCase().split(/\s+/)
          words.forEach(word => {
            if (word.length > 3) { // Only count meaningful words
              wordCount[word] = (wordCount[word] || 0) + 1
            }
          })
        })
      }
    })

    const topWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    // Streak analysis
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date))
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let lastDate = null

    sortedEntries.forEach(entry => {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)

      if (lastDate) {
        const diffDays = Math.floor((entryDate - lastDate) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          tempStreak++
          currentStreak = tempStreak
          longestStreak = Math.max(longestStreak, tempStreak)
        } else if (diffDays > 1) {
          tempStreak = 1
          currentStreak = 1
        }
      } else {
        tempStreak = 1
        currentStreak = 1
        longestStreak = 1
      }

      lastDate = entryDate
    })

    return {
      totalEntries,
      avgItemsPerEntry: Math.round(avgItemsPerEntry * 10) / 10,
      avgMoodRating: Math.round(avgMoodRating * 10) / 10,
      categoryCount,
      monthlyData,
      dayOfWeekCount,
      topWords,
      currentStreak,
      longestStreak
    }
  }, [entries])

  if (!analytics) return null

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const mostActiveDay = analytics.dayOfWeekCount.indexOf(Math.max(...analytics.dayOfWeekCount))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 size={20} className="text-blue-500" />
        <span className="font-semibold text-lg text-gray-900 dark:text-white">Gratitude Analytics</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-2">
            <Calendar size={24} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-500">{analytics.totalEntries}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-2">
            <Target size={24} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-500">{analytics.avgItemsPerEntry}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Items/Entry</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-2">
            <Heart size={24} className="text-pink-500" />
          </div>
          <p className="text-2xl font-bold text-pink-500">{analytics.avgMoodRating}/5</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Mood</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-2">
            <TrendingUp size={24} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-500">{analytics.longestStreak}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={20} className="text-orange-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Category Distribution</span>
          </div>
          <div className="space-y-3">
            {Object.entries(analytics.categoryCount)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([catId, count]) => {
                const category = GRATITUDE_CATEGORIES.find(c => c.id === catId)
                const percentage = Math.round((count / analytics.totalEntries) * 100)
                return (
                  <div key={catId}>
                    <div className="flex justify-between mb-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{category?.icon || '✨'}</span>
                        <span className="text-gray-700 dark:text-gray-300">{category?.name || catId}</span>
                      </div>
                      <span className="text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Activity Patterns */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-teal-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Activity Patterns</span>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Most Active Day</p>
              <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 rounded-full text-sm font-medium">
                {dayNames[mostActiveDay]} ({analytics.dayOfWeekCount[mostActiveDay]} entries)
              </span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Streak</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-teal-500">
                  {analytics.currentStreak} days
                </span>
                <span className="text-sm text-gray-500">
                  (Best: {analytics.longestStreak})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Words */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-purple-500" />
          <span className="font-semibold text-gray-900 dark:text-white">Most Common Words in Your Gratitude</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {analytics.topWords.map(([word, count]) => (
            <span
              key={word}
              className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm font-medium"
            >
              {word} ({count})
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GratitudeAnalytics