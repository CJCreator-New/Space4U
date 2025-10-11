import { useState, useEffect, useRef } from 'react'

export function usePullToRefresh(onRefresh) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const threshold = 80

  useEffect(() => {
    let touchStartY = 0

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY
        startY.current = touchStartY
      }
    }

    const handleTouchMove = (e) => {
      if (window.scrollY === 0 && startY.current > 0) {
        const currentY = e.touches[0].clientY
        const distance = currentY - startY.current
        
        if (distance > 0) {
          setPullDistance(Math.min(distance, threshold * 1.5))
          if (distance > threshold) {
            setIsPulling(true)
          }
        }
      }
    }

    const handleTouchEnd = async () => {
      if (isPulling && pullDistance > threshold) {
        await onRefresh()
      }
      setIsPulling(false)
      setPullDistance(0)
      startY.current = 0
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, pullDistance, onRefresh])

  return { isPulling, pullDistance }
}
