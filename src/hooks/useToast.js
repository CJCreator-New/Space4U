import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((message, duration) => {
    showToast(message, 'success', duration)
  }, [showToast])

  const error = useCallback((message, duration) => {
    showToast(message, 'error', duration)
  }, [showToast])

  const info = useCallback((message, duration) => {
    showToast(message, 'info', duration)
  }, [showToast])

  const warning = useCallback((message, duration) => {
    showToast(message, 'warning', duration)
  }, [showToast])

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    info,
    warning
  }
}
