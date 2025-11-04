import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Star, Zap } from 'lucide-react'

function LevelUpCelebration({ level, show, onComplete }) {
  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 1
          }}
          className="bg-surface rounded-3xl p-8 max-w-lg w-full text-center relative overflow-hidden"
        >
          {/* Animated background effects */}
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.3), transparent)',
                'radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.3), transparent)',
                'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3), transparent)',
                'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.3), transparent)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />

          {/* Floating orbs */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 15 }, (_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  scale: 0
                }}
                animate={{
                  scale: [0, 1, 0.8, 1, 0],
                  opacity: [0, 1, 1, 1, 0]
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
              />
            ))}
          </div>

          <div className="relative z-10">
            {/* Crown with glow effect */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="mb-6"
            >
              <motion.div
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))',
                    'drop-shadow(0 0 40px rgba(168, 85, 247, 0.9))',
                    'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))'
                  ],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  filter: { duration: 2, repeat: Infinity },
                  scale: { duration: 1.5, repeat: Infinity, delay: 0.5 }
                }}
                className="inline-block"
              >
                <Crown size={80} className="text-purple-500" />
              </motion.div>
            </motion.div>

            {/* Level number with burst effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 15 }}
              className="mb-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  textShadow: [
                    '0 0 10px rgba(168, 85, 247, 0.5)',
                    '0 0 30px rgba(168, 85, 247, 0.9)',
                    '0 0 10px rgba(168, 85, 247, 0.5)'
                  ]
                }}
                transition={{
                  scale: { duration: 0.8, repeat: 2, delay: 0.6 },
                  textShadow: { duration: 1.5, repeat: Infinity }
                }}
                className="text-6xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
              >
                LEVEL {level}
              </motion.div>
            </motion.div>

            {/* Celebration text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-2xl font-bold text-text-primary dark:text-white mb-2"
            >
              Level Up! 🎉
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-text-secondary dark:text-gray-300 mb-6"
            >
              You've reached a new level of wellness mastery! Keep growing! 🌱
            </motion.p>

            {/* Achievement badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex justify-center gap-4 mb-6"
            >
              {Array.from({ length: Math.min(level, 5) }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 1.2 + i * 0.1,
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                  }}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
                >
                  <Star size={20} className="text-white" />
                </motion.div>
              ))}
            </motion.div>

            {/* Continue button with energy effect */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="relative px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden group"
            >
              <motion.div
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="relative z-10 flex items-center gap-2">
                <Zap size={18} />
                Continue Growing
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LevelUpCelebration