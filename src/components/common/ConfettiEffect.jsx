import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function ConfettiEffect({ show, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: ['#667eea', '#764ba2', '#f093fb', '#4facfe'][Math.floor(Math.random() * 4)],
        size: Math.random() * 10 + 5
      }))
      setParticles(newParticles)
      
      setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 3000)
    }
  }, [show, onComplete])

  if (!show || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size
          }}
          initial={{ y: particle.y, opacity: 1, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 20, 
            opacity: 0,
            rotate: 360
          }}
          transition={{ 
            duration: 2 + Math.random(), 
            ease: 'easeIn' 
          }}
        />
      ))}
    </div>
  )
}

export default ConfettiEffect
