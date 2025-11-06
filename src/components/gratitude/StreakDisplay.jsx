import { motion } from 'framer-motion'
import { Flame, Trophy, Target } from 'lucide-react'

export default function StreakDisplay({ current, longest }) {
  const milestones = [7, 14, 30, 60, 100]
  const nextMilestone = milestones.find(m => m > current) || milestones[milestones.length - 1]
  const progress = (current / nextMilestone) * 100

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500 rounded-xl">
            <Flame className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-gray-900">{current} Days</h3>
            <p className="text-sm text-gray-600">Current Streak</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-gray-600">
            <Trophy size={16} />
            <span className="text-sm">Best: {longest}</span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress to {nextMilestone} days</span>
          <span className="font-medium">{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-400 to-red-500"
          />
        </div>
      </div>

      {current >= 7 && (
        <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-100 px-3 py-2 rounded-lg">
          <Target size={16} />
          <span className="font-medium">Amazing! Keep the momentum going! 🎉</span>
        </div>
      )}
    </div>
  )
}
