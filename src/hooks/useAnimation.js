import { useCallback } from 'react'

export function useAnimation() {
  const triggerConfetti = useCallback(() => {
    const colors = ['🎉', '✨', '🌟', '💫', '⭐']
    const container = document.createElement('div')
    container.className = 'fixed inset-0 pointer-events-none z-50'
    document.body.appendChild(container)

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.textContent = colors[Math.floor(Math.random() * colors.length)]
      confetti.className = 'absolute text-2xl'
      confetti.style.left = Math.random() * 100 + '%'
      confetti.style.animationDelay = Math.random() * 2 + 's'
      confetti.style.animation = 'confetti 3s linear forwards'
      container.appendChild(confetti)
    }

    setTimeout(() => {
      document.body.removeChild(container)
    }, 3000)
  }, [])

  const animateHeart = useCallback((element) => {
    if (!element) return
    
    element.classList.add('animate-heartbeat')
    element.style.color = '#ef4444'
    
    setTimeout(() => {
      element.classList.remove('animate-heartbeat')
    }, 300)
  }, [])

  const animateSuccess = useCallback((element) => {
    if (!element) return
    
    element.classList.add('animate-bounce-in')
    
    setTimeout(() => {
      element.classList.remove('animate-bounce-in')
    }, 500)
  }, [])

  const staggerItems = useCallback((container, delay = 50) => {
    if (!container) return
    
    const items = container.children
    Array.from(items).forEach((item, index) => {
      item.style.opacity = '0'
      item.style.transform = 'translateY(20px)'
      
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease-out'
        item.style.opacity = '1'
        item.style.transform = 'translateY(0)'
      }, index * delay)
    })
  }, [])

  return {
    triggerConfetti,
    animateHeart,
    animateSuccess,
    staggerItems
  }
}

export default useAnimation