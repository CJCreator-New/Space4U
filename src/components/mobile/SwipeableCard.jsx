import { useState, useRef } from 'react'
import { useCapacitor } from '../../hooks/useCapacitor'

function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  swipeThreshold = 100,
  className = '' 
}) {
  const { hapticFeedback } = useCapacitor()
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef(null)

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    setCurrentX(e.touches[0].clientX)
    
    const deltaX = e.touches[0].clientX - startX
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px)`
      cardRef.current.style.opacity = 1 - Math.abs(deltaX) / 300
    }
  }

  const handleTouchEnd = async () => {
    if (!isDragging) return
    setIsDragging(false)
    
    const deltaX = currentX - startX
    
    if (Math.abs(deltaX) > swipeThreshold) {
      await hapticFeedback()
      
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }
    
    // Reset position
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0px)'
      cardRef.current.style.opacity = '1'
    }
  }

  return (
    <div
      ref={cardRef}
      className={`touch-pan-y ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

export default SwipeableCard