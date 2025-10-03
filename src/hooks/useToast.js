import { useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import Toast from '../components/common/Toast'

let toastContainer = null
let toastRoot = null
let toastId = 0

const initToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    document.body.appendChild(toastContainer)
    toastRoot = createRoot(toastContainer)
  }
}

const activeToasts = new Map()

const renderToasts = () => {
  if (!toastRoot) return
  
  const toasts = Array.from(activeToasts.values())
  toastRoot.render(
    <div>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={(id) => {
            activeToasts.delete(id)
            renderToasts()
          }}
        />
      ))}
    </div>
  )
}

export function useToast() {
  const showToast = useCallback(({ type = 'info', message, duration = 3000 }) => {
    initToastContainer()
    
    const id = ++toastId
    const toast = { id, type, message, duration }
    
    activeToasts.set(id, toast)
    renderToasts()
    
    return id
  }, [])

  const hideToast = useCallback((id) => {
    activeToasts.delete(id)
    renderToasts()
  }, [])

  const hideAllToasts = useCallback(() => {
    activeToasts.clear()
    renderToasts()
  }, [])

  return { showToast, hideToast, hideAllToasts }
}

export default useToast