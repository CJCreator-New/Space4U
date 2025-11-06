import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Flame } from 'lucide-react'

function StreakCelebration({ streak, show, onComplete }) {
  if (!show) return null

  const getMilestoneMessage = (streak) => {
    if (streak >= 100) return "Century Streak! 🏆"
    if (streak >= 30) return "Monthly Master! 📅"
    if (streak >= 14) return "Two Week Warrior! ⚔️"
    if (streak >= 7) return "Week Winner! 🎯"
    return "Streak Started! 🔥"
  }

  const getMilestoneColor = (streak) => {
    if (streak >= 100) return "from-purple-500 to-pink-500"
    if (streak >= 30) return "from-blue-500 to-cyan-500"
    if (streak >= 14) return "from-orange-500 to-red-500"
    if (streak >= 7) return "from-yellow-500 to-orange-500"
    return "from-green-500 to-emerald-500"
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.8
          }}
          className="bg-surface rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <motion.div
            animate={{
              background: [
                `linear-gradient(45deg, ${getMilestoneColor(streak).split(' ')[0]}, ${getMilestoneColor(streak).split(' ')[1]})`,
                `linear-gradient(135deg, ${getMilestoneColor(streak).split(' ')[0]}, ${getMilestoneColor(streak).split(' ')[1]})`,
                `linear-gradient(225deg, ${getMilestoneColor(streak).split(' ')[0]}, ${getMilestoneColor(streak).split(' ')[1]})`,
                `linear-gradient(315deg, ${getMilestoneColor(streak).split(' ')[0]}, ${getMilestoneColor(streak).split(' ')[1]})`
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 opacity-10 bg-gradient-to-br ${getMilestoneColor(streak)}`}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 100 + '%',
                  y: '100%',
                  rotate: 0,
                  scale: 0
                }}
                animate={{
                  y: '-20%',
                  rotate: 360,
                  scale: [0, 1, 0.8, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute text-xl"
              >
                {['🎉', '✨', '🌟', '🎊', '💫', '⭐', '🏆', '🔥'][Math.floor(Math.random() * 8)]}
              </motion.div>
            ))}
          </div>

          <div className="relative z-10">
            {/* Trophy icon with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [180, 0, -10, 10, 0]
              }}
              transition={{
                scale: { duration: 0.8, type: "spring", stiffness: 300 },
                rotate: { duration: 1.2, delay: 0.3 }
              }}
              className="mb-6 inline-block"
            >
              <motion.div
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))',
                    'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))',
                    'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy size={80} className="text-yellow-500" />
              </motion.div>
            </motion.div>

            {/* Streak counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  color: ['#fbbf24', '#f59e0b', '#fbbf24']
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center justify-center gap-2 mb-2"
              >
                <Flame className="text-orange-500" size={32} />
                <span className="text-4xl font-bold text-orange-500">{streak}</span>
                <Flame className="text-orange-500" size={32} />
              </motion.div>
              <p className="text-sm text-text-secondary">Day Streak</p>
            </motion.div>

            {/* Milestone message */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-2xl font-bold text-text-primary dark:text-white mb-3"
            >
              {getMilestoneMessage(streak)}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-text-secondary dark:text-gray-300 mb-6"
            >
              Keep up the amazing work! Your consistency is inspiring. 🌟
            </motion.p>

            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Continue Journey
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StreakCelebration