import { useSwipeActions } from '../../hooks/useSwipeActions'
import { useHaptic } from '../../hooks/useHaptic'

function SwipeableListItem({ children, leftActions = [], rightActions = [] }) {
  const { swipeX, isRevealed, handleTouchStart, handleTouchMove, handleTouchEnd, reset } = useSwipeActions()
  const { vibrate } = useHaptic()

  const handleAction = (action) => {
    vibrate('medium')
    action.onPress()
    reset()
  }

  return (
    <div className="relative overflow-hidden">
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center">
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action)}
              className="h-full px-6 flex items-center justify-center text-white transition-all"
              style={{
                backgroundColor: action.color || '#EF4444',
                transform: `translateX(${Math.max(0, swipeX - 100)}px)`
              }}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action)}
              className="h-full px-6 flex items-center justify-center text-white transition-all"
              style={{
                backgroundColor: action.color || '#3B82F6',
                transform: `translateX(${Math.min(0, swipeX + 100)}px)`
              }}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: isRevealed ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
        className="bg-surface dark:bg-gray-800"
      >
        {children}
      </div>
    </div>
  )
}

export default SwipeableListItem
