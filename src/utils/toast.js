// Simple toast notification system
let toastContainer = null

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none'
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

const showToast = (message, type = 'info', duration = 3000) => {
  const container = createToastContainer()
  
  const toast = document.createElement('div')
  toast.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-white font-medium transform transition-all duration-300 translate-x-0 opacity-100 ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-orange-500' :
    'bg-blue-500'
  }`
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'
  toast.innerHTML = `<span class="mr-2">${icon}</span>${message}`
  
  container.appendChild(toast)
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  }, 10)
  
  // Auto dismiss
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    toast.style.opacity = '0'
    setTimeout(() => {
      container.removeChild(toast)
      if (container.children.length === 0) {
        document.body.removeChild(container)
        toastContainer = null
      }
    }, 300)
  }, duration)
}

export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  warning: (message, duration) => showToast(message, 'warning', duration),
  info: (message, duration) => showToast(message, 'info', duration)
}
