import { useEffect } from 'react'

function ConfettiExplosion({ active, onComplete }) {
  useEffect(() => {
    if (!active) return

    const colors = ['#FFD93D', '#FF6B6B', '#4ECDC4', '#95E1D3', '#6B73FF', '#9B59B6', '#2ECC71', '#FF8C42']
    const confettiCount = 100
    const duration = 3000
    const confettiElements = []

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 12 + 4
      const angle = (Math.PI * 2 * i) / confettiCount
      const velocity = Math.random() * 300 + 200
      const rotation = Math.random() * 720
      
      confetti.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        z-index: 10000;
        pointer-events: none;
        animation: confettiBlast ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        --tx: ${Math.cos(angle) * velocity}px;
        --ty: ${Math.sin(angle) * velocity - 100}px;
        --rotation: ${rotation}deg;
      `
      
      document.body.appendChild(confetti)
      confettiElements.push(confetti)
    }

    const timer = setTimeout(() => {
      confettiElements.forEach(el => el.remove())
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(timer)
      confettiElements.forEach(el => el.remove())
    }
  }, [active, onComplete])

  return null
}

if (typeof document !== 'undefined' && !document.getElementById('confetti-styles')) {
  const style = document.createElement('style')
  style.id = 'confetti-styles'
  style.textContent = `
    @keyframes confettiBlast {
      0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
      100% { transform: translate(var(--tx), calc(var(--ty) + 100vh)) rotate(var(--rotation)); opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

export default ConfettiExplosion
