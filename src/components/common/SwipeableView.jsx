import { useState } from 'react'
import { useSwipeGesture } from '../../hooks/useSwipeGesture'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function SwipeableView({ children, onSwipeLeft, onSwipeRight, showIndicators = true }) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
    onSwipeLeft: () => {
      setSwipeOffset(-20)
      setTimeout(() => setSwipeOffset(0), 200)
      onSwipeLeft?.()
    },
    onSwipeRight: () => {
      setSwipeOffset(20)
      setTimeout(() => setSwipeOffset(0), 200)
      onSwipeRight?.()
    },
    threshold: 50
  })

  const handleTouchStart = (e) => {
    setIsSwiping(true)
    onTouchStart(e)
  }

  const handleTouchEnd = (e) => {
    setIsSwiping(false)
    onTouchEnd(e)
  }

  return (
    <div className="relative overflow-hidden">
      {showIndicators && (
        <>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30">
            <ChevronLeft size={32} className="text-text-secondary" />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30">
            <ChevronRight size={32} className="text-text-secondary" />
          </div>
        </>
      )}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default SwipeableView
