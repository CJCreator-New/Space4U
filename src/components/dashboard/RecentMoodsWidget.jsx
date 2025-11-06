import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Smile, Frown, Meh } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useSupabaseAuth } from '../../contexts/AuthContext'
import { format, startOfWeek, endOfWeek } from 'date-fns'

export default function RecentMoodsWidget() {
  const navigate = useNavigate()
  const { user } = useSupabaseAuth()
  const [moodLogs, setMoodLogs] = useState([])
  const [weeklyAverage, setWeeklyAverage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRecentMoods()
    }
  }, [user])

  const fetchRecentMoods = async () => {
    try {
      setIsLoading(true)
      const weekStart = startOfWeek(new Date())
      const weekEnd = endOfWeek(new Date())

      const { data, error } = await supabase
        .from('emotion_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString())
        .order('created_at', { ascending: false })
        .limit(7)

      if (error) throw error

      setMoodLogs(data || [])
      
      // Calculate weekly average
      if (data && data.length > 0) {
        const avg = data.reduce((sum, log) => sum + log.mood_value, 0) / data.length
        setWeeklyAverage(avg)
      }
    } catch (error) {
      console.error('Error fetching moods:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMoodIcon = (value) => {
    if (value >= 4) return <Smile className="text-green-500" size={20} />
    if (value >= 2.5) return <Meh className="text-yellow-500" size={20} />
    return <Frown className="text-red-500" size={20} />
  }

  const getMoodColor = (value) => {
    if (value >= 4) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
    if (value >= 2.5) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
    return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
  }

  const getTrendIcon = () => {
    if (!weeklyAverage) return null
    if (weeklyAverage >= 4) return '📈'
    if (weeklyAverage >= 2.5) return '➡️'
    return '📉'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
      onClick={() => navigate('/emotions')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-text-primary dark:text-white">Recent Moods</h3>
            <p className="text-sm text-text-secondary dark:text-gray-400">This week</p>
          </div>
        </div>
        {weeklyAverage && (
          <div className="text-2xl" title={`Average: ${weeklyAverage.toFixed(1)}/5`}>
            {getTrendIcon()}
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : moodLogs.length === 0 ? (
        <div className="text-center py-8">
          <Smile size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-text-secondary dark:text-gray-400 mb-2">No moods logged this week</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate('/emotions')
            }}
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            Log your first mood →
          </button>
        </div>
      ) : (
        <>
          {/* Mood List */}
          <div className="space-y-2 mb-4">
            {moodLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${getMoodColor(log.mood_value)}`}
              >
                <div className="flex items-center gap-3">
                  {getMoodIcon(log.mood_value)}
                  <div>
                    <p className="font-medium text-sm text-text-primary dark:text-white">
                      {log.emotion || 'Mood Log'}
                    </p>
                    <p className="text-xs text-text-tertiary dark:text-gray-500">
                      {format(new Date(log.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-text-primary dark:text-white">
                  {log.mood_value}/5
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Average */}
          {weeklyAverage && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-text-primary dark:text-white">
                    Weekly Average
                  </span>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {weeklyAverage.toFixed(1)}/5
                </span>
              </div>
            </div>
          )}

          {/* View More */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate('/analytics')
            }}
            className="w-full mt-3 text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
          >
            View detailed analytics →
          </button>
        </>
      )}
    </motion.div>
  )
}
