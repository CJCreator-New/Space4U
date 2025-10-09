import { X, Keyboard } from 'lucide-react'

function KeyboardHelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const shortcuts = [
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: '/', description: 'Focus search' },
    { key: 'h', description: 'Go to Home' },
    { key: 'c', description: 'Go to Circles' },
    { key: 'i', description: 'Go to Insights' },
    { key: 'p', description: 'Go to Profile' },
    { key: 'Esc', description: 'Close modals' },
    { key: 'Tab', description: 'Navigate forward' },
    { key: 'Shift + Tab', description: 'Navigate backward' },
    { key: 'Enter', description: 'Activate button/link' },
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-labelledby="keyboard-help-title"
      aria-modal="true"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="text-primary dark:text-primary-light" size={24} />
            <h2 id="keyboard-help-title" className="text-xl font-semibold text-text-primary dark:text-white">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close keyboard shortcuts help"
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-text-primary dark:text-white" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              <span className="text-text-secondary dark:text-gray-300">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono text-text-primary dark:text-white">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-secondary dark:text-gray-400 mt-4 text-center">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">?</kbd> anytime to see this help
        </p>
      </div>
    </div>
  )
}

export default KeyboardHelpModal
