import { motion } from 'framer-motion'
import { Flame, Trophy, Target } from 'lucide-react'

export default function StreakDisplay({ current, longest }) {
  const milestones = [7, 14, 30, 60, 100]
  const nextMilestone = milestones.find(m => m > current) || milestones[milestones.length - 1]
  const progress = (current / nextMilestone) * 100

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/30">
            <Flame className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{current} Days</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-lg">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-sm font-medium">Best: {longest}</span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress to {nextMilestone} days</span>
          <span className="font-medium">{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-400 to-red-500"
          />
        </div>
      </div>

      {current >= 7 && (
        <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
          <Target size={16} />
          <span className="font-medium">Amazing! Keep the momentum going! 🎉</span>
        </div>
      )}
    </div>
  )
}
