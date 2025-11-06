import { createContext, useContext, useState, useCallback } from 'react'

const ReminderContext = createContext()

export const useReminders = () => {
  const context = useContext(ReminderContext)
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider')
  }
  return context
}

export const ReminderProvider = ({ children }) => {
  const [activeToasts, setActiveToasts] = useState([])

  const showReminder = useCallback((message, options = {}) => {
    const {
      type = 'reminder',
      duration = 5000,
      action,
      actionLabel
    } = options

    const id = Date.now() + Math.random()
    
    const toast = {
      id,
      message,
      type,
      duration,
      action,
      actionLabel
    }

    setActiveToasts(prev => [...prev, toast])

    // Auto-remove after duration + exit animation
    if (duration > 0) {
      setTimeout(() => {
        dismissReminder(id)
      }, duration + 300)
    }

    return id
  }, [])

  const dismissReminder = useCallback((id) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const dismissAllReminders = useCallback(() => {
    setActiveToasts([])
  }, [])

  const value = {
    activeToasts,
    showReminder,
    dismissReminder,
    dismissAllReminders
  }

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  )
}