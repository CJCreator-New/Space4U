import { useState, useRef } from 'react'

export function useSwipeActions() {
  const [swipeX, setSwipeX] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const startX = useRef(0)
  const currentX = useRef(0)

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    currentX.current = e.touches[0].clientX
    const diff = currentX.current - startX.current
    
    if (Math.abs(diff) > 10) {
      setSwipeX(diff)
    }
  }

  const handleTouchEnd = () => {
    const threshold = 80
    
    if (Math.abs(swipeX) > threshold) {
      setIsRevealed(true)
      setSwipeX(swipeX > 0 ? 100 : -100)
    } else {
      reset()
    }
  }

  const reset = () => {
    setSwipeX(0)
    setIsRevealed(false)
  }

  return {
    swipeX,
    isRevealed,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    reset
  }
}
