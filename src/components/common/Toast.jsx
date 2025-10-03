import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const TOAST_TYPES = {
  success: { icon: CheckCircle, bgColor: 'bg-green-500', textColor: 'text-white' },
  error: { icon: AlertCircle, bgColor: 'bg-red-500', textColor: 'text-white' },
  info: { icon: Info, bgColor: 'bg-blue-500', textColor: 'text-white' },
  warning: { icon: AlertTriangle, bgColor: 'bg-orange-500', textColor: 'text-white' }
}

function Toast({ id, type = 'info', message, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  
  const { icon: Icon, bgColor, textColor } = TOAST_TYPES[type]

  useEffect(() => {
    setIsVisible(true)
    
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div
      className={`
        fixed z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg max-w-sm w-full
        ${bgColor} ${textColor}
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        bottom-4 left-1/2 transform -translate-x-1/2
        md:bottom-auto md:top-4 md:right-4 md:left-auto md:transform-none
      `}
    >
      <Icon size={20} className="flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default Toast