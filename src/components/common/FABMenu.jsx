import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useHaptic } from '../../hooks/useHaptic'

function FABMenu({ actions = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const { vibrate } = useHaptic()

  const handleToggle = () => {
    vibrate('light')
    setIsOpen(!isOpen)
  }

  const handleAction = (action) => {
    vibrate('medium')
    action.onClick()
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className="fixed bottom-20 right-4 md:bottom-8 z-50 flex flex-col-reverse items-end gap-3">
        {isOpen && actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center gap-3 animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
              {action.label}
            </span>
            <button
              onClick={() => handleAction(action)}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform active:scale-95"
              aria-label={action.label}
            >
              {action.icon}
            </button>
          </div>
        ))}
        
        <button
          onClick={handleToggle}
          className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>
    </>
  )
}

export default FABMenu
