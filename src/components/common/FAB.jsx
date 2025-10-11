import { useHaptic } from '../../hooks/useHaptic'

function FAB({ icon, onClick, className = '' }) {
  const { vibrate } = useHaptic()

  const handleClick = () => {
    vibrate('medium')
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-20 right-4 md:bottom-8 z-50 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 ${className}`}
      aria-label="Quick action"
    >
      {icon}
    </button>
  )
}

export default FAB
