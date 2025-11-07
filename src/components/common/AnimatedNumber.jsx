import { useEffect, useState, useRef } from 'react'

function AnimatedNumber({ value, duration = 1000, className = '' }) {
  const [displayValue, setDisplayValue] = useState(0)
  const animationRef = useRef(null)

  useEffect(() => {
    const start = displayValue
    const end = value
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(start + (end - start) * easeOut)
      
      setDisplayValue(current)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    animate()

    // Cleanup on unmount or value change
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  return <span className={className}>{displayValue}</span>
}

export default AnimatedNumber
