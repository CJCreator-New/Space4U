import { useMemo } from 'react'
import { Calendar, TrendingUp, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WeeklySummary({ entries }) {
  const summary = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const weekEntries = Object.entries(entries).filter(([date]) => {
      return new Date(date) >= weekAgo
    })

    const totalWords = weekEntries.reduce((sum, [, entry]) => {
      return sum + (entry.text?.split(' ').length || 0)
    }, 0)

    const avgWords = weekEntries.length > 0 ? Math.round(totalWords / weekEntries.length) : 0

    return {
      count: weekEntries.length,
      totalWords,
      avgWords,
      entries: weekEntries
    }
  }, [entries])

  if (summary.count === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
        <h3 className="font-semibold text-gray-900 mb-2">No Entries This Week</h3>
        <p className="text-gray-600 text-sm">Start journaling to see your weekly summary</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-purple-600" size={20} />
        <h3 className="font-semibold text-gray-900">This Week's Reflection</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{summary.count}</div>
          <div className="text-sm text-gray-600">Entries</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{summary.totalWords}</div>
          <div className="text-sm text-gray-600">Words</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{summary.avgWords}</div>
          <div className="text-sm text-gray-600">Avg/Entry</div>
        </div>
      </div>

      {summary.count >= 5 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-start gap-3">
            <Heart className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-1">Consistency Milestone! 🎉</p>
              <p className="text-gray-700">
                You've journaled {summary.count} times this week. Regular reflection strengthens gratitude and well-being.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
