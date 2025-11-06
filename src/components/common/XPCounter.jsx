import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function XPCounter({ xp, show, onComplete }) {
  const [displayXP, setDisplayXP] = useState(0)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show && xp > 0) {
      // Animate XP counting up
      const duration = 1000 // 1 second
      const steps = 60
      const increment = xp / steps
      let current = 0
      let step = 0

      const timer = setInterval(() => {
        current += increment
        step++

        if (step >= steps) {
          setDisplayXP(xp)
          clearInterval(timer)
          setTimeout(() => onComplete?.(), 500)
        } else {
          setDisplayXP(Math.floor(current))
        }
      }, duration / steps)

      // Create particles
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)]
      }))
      setParticles(newParticles)

      // Clean up particles after animation
      setTimeout(() => setParticles([]), 2000)

      return () => clearInterval(timer)
    }
  }, [show, xp, onComplete])

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed top-4 right-4 z-50"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-lg relative overflow-hidden"
        >
          {/* Background glow effect */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(251, 191, 36, 0.5)',
                '0 0 40px rgba(251, 191, 36, 0.8)',
                '0 0 20px rgba(251, 191, 36, 0.5)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-lg"
          />

          {/* XP text */}
          <motion.span
            key={displayXP}
            initial={{ scale: 1.2, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="relative z-10"
          >
            +{displayXP} XP
          </motion.span>

          {/* Floating particles */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${particle.x}%`,
                  y: `${particle.y}%`,
                  scale: [0, 1, 0.8],
                  opacity: [1, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5
                }}
                className="absolute text-sm pointer-events-none"
              >
                {particle.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default XPCounter