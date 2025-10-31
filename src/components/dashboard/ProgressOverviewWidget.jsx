import { useState, useEffect } from 'react'
import { Target, TrendingUp, Award, Calendar as CalendarIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useSupabaseAuth } from '../../contexts/AuthContext'
import { differenceInDays, startOfMonth } from 'date-fns'

export default function ProgressOverviewWidget() {
  const navigate = useNavigate()
  const { user } = useSupabaseAuth()
  const [stats, setStats] = useState({
    moodStreak: 0,
    gratitudeEntries: 0,
    activeDays: 0,
    completedGoals: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProgressStats()
    }
  }, [user])

  const fetchProgressStats = async () => {
    try {
      setIsLoading(true)
      const monthStart = startOfMonth(new Date())

      // Fetch mood streak
      const { data: moodData } = await supabase
        .from('emotion_logs')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)

      // Calculate streak
      let streak = 0
      if (moodData && moodData.length > 0) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        for (let i = 0; i < moodData.length; i++) {
          const logDate = new Date(moodData[i].created_at)
          logDate.setHours(0, 0, 0, 0)
          const daysDiff = differenceInDays(today, logDate)
          
          if (daysDiff === i) {
            streak++
          } else {
            break
          }
        }
      }

      // Fetch gratitude entries this month
      // Gratitude entries may not exist in the remote schema for some
      // deployments. If the table is missing, fall back to localStorage.
      let gratitudeCount = 0
      try {
        const res = await supabase
          .from('gratitude_entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', monthStart.toISOString())
        if (res && res.count !== undefined) {
          gratitudeCount = res.count
        }
      } catch (err) {
        // If table doesn't exist (PGRST205) use localStorage fallback
        if (err && err.code === 'PGRST205') {
          const saved = JSON.parse(localStorage.getItem('space4u_gratitude_entries') || '[]')
          gratitudeCount = saved.filter(e => new Date(e.date) >= monthStart).length
        } else {
          console.error('Error fetching gratitude entries:', err)
        }
      }

      // Calculate active days this month
      const { data: activityData } = await supabase
        .from('emotion_logs')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', monthStart.toISOString())

      const uniqueDays = new Set()
      activityData?.forEach(log => {
        const date = new Date(log.created_at).toDateString()
        uniqueDays.add(date)
      })

      setStats({
        moodStreak: streak,
        gratitudeEntries: gratitudeCount || 0,
        activeDays: uniqueDays.size,
        completedGoals: 0 // TODO: Implement goals system
      })
    } catch (error) {
      console.error('Error fetching progress stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: stats.moodStreak,
      unit: 'days',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      borderColor: 'border-orange-300 dark:border-orange-700',
      onClick: () => navigate('/emotions')
    },
    {
      icon: CalendarIcon,
      label: 'Active Days',
      value: stats.activeDays,
      unit: 'this month',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-300 dark:border-blue-700',
      onClick: () => navigate('/analytics')
    },
    {
      icon: Award,
      label: 'Gratitude Entries',
      value: stats.gratitudeEntries,
      unit: 'this month',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-300 dark:border-green-700',
      onClick: () => navigate('/gratitude')
    },
    {
      icon: Target,
      label: 'Goals',
      value: stats.completedGoals,
      unit: 'completed',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-300 dark:border-purple-700',
      onClick: () => navigate('/wellness-plan')
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
          <Target className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-text-primary dark:text-white">Progress Overview</h3>
          <p className="text-sm text-text-secondary dark:text-gray-400">Your wellness journey</p>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {statCards.map((stat, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={stat.onClick}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 text-left hover:shadow-md transition-all group`}
            >
              <div className="flex items-start justify-between mb-3">
                <stat.icon className={stat.color} size={24} />
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ x: 3 }}
                >
                  <span className={`text-sm ${stat.color}`}>â†’</span>
                </motion.div>
              </div>
              
              <div className="mb-1">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-xs text-text-tertiary dark:text-gray-500">
                    {stat.unit}
                  </span>
                </div>
              </div>
              
              <p className="text-xs font-medium text-text-secondary dark:text-gray-400">
                {stat.label}
              </p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Motivational Message */}
      {!isLoading && stats.moodStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <p className="text-sm text-text-primary dark:text-white">
            ðŸŽ‰ <strong>Great job!</strong> You're on a {stats.moodStreak}-day streak! Keep it up!
          </p>
        </motion.div>
      )}

      {!isLoading && stats.moodStreak === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
        >
          <p className="text-sm text-text-primary dark:text-white">
            ðŸ’ª <strong>Start today!</strong> Log your mood to begin building your streak.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

