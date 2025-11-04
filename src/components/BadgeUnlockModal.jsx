import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share } from 'lucide-react'

function BadgeUnlockModal({ badge, isOpen, onClose, onShare }) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen || !badge) return null

  const handleShare = () => {
    onShare?.(badge)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          {/* Enhanced Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                    y: window.innerHeight + 100,
                    rotate: 0,
                    scale: 0
                  }}
                  animate={{
                    y: -100,
                    rotate: 360,
                    scale: [0, 1, 0.8, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: "easeOut",
                    delay: Math.random() * 0.5
                  }}
                  className="absolute text-2xl"
                >
                  {['🎉', '✨', '🌟', '🎊', '💫', '⭐'][Math.floor(Math.random() * 6)]}
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.6
            }}
            className="bg-surface rounded-3xl p-8 max-w-sm w-full text-center relative"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={20} />
            </motion.button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
              className="mb-6"
            >
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -5, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="text-8xl mb-4 inline-block"
              >
                {badge.emoji}
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-text-primary dark:text-white mb-2"
            >
              Achievement Unlocked!
            </motion.h2>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-semibold text-primary mb-3"
            >
              {badge.name}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-text-secondary dark:text-gray-300 mb-6"
            >
              {badge.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-3 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <Share size={18} />
                Share
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BadgeUnlockModal