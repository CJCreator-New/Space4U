import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

function HabitCompletionEffect({ show, onComplete }) {
  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      >
        {/* Background burst effect */}
        <div className="relative">
          {/* Central checkmark */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              duration: 0.6
            }}
            className="relative z-20"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 0 0 rgba(34, 197, 94, 0.7)',
                  '0 0 0 20px rgba(34, 197, 94, 0)',
                  '0 0 0 0 rgba(34, 197, 94, 0)'
                ]
              }}
              transition={{
                scale: { duration: 0.8, repeat: 1 },
                boxShadow: { duration: 1.2 }
              }}
            >
              <CheckCircle2 size={80} className="text-green-500 drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* Burst particles */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const distance = 100
            const x = Math.cos(angle) * distance
            const y = Math.sin(angle) * distance

            return (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: x,
                  y: y,
                  scale: [0, 1, 0.5],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                  delay: 0.2
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 0.8, 1]
                  }}
                  transition={{
                    rotate: { duration: 1, ease: "easeOut" },
                    scale: { duration: 0.6, repeat: 1 }
                  }}
                  className="text-2xl"
                >
                  {['✨', '⭐', '💫', '🌟', '🎉'][i % 5]}
                </motion.div>
              </motion.div>
            )
          })}

          {/* Ripple effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-4 border-green-400 rounded-full"
          />
        </div>

        {/* Success text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute top-full mt-4 text-center"
        >
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-white text-xl font-bold drop-shadow-lg"
          >
            Habit Completed! 🎉
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default HabitCompletionEffect