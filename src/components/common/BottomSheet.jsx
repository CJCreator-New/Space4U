import { useBottomSheet } from '../../hooks/useBottomSheet'

function BottomSheet({ isOpen, onClose, children, snapPoints = ['50%', '90%'], initialSnap = 0 }) {
  const { dragY, handleTouchStart, handleTouchMove, handleTouchEnd } = useBottomSheet(isOpen, onClose)

  if (!isOpen) return null

  const height = snapPoints[initialSnap]

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative bg-surface dark:bg-gray-800 w-full rounded-t-3xl shadow-2xl animate-slideUp"
        style={{
          height,
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full py-4 flex justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
        <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 40px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default BottomSheet
