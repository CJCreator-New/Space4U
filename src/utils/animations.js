// Advanced Animation System

export const ANIMATION_PRESETS = {
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-200',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-500',
  slideDown: 'animate-in slide-in-from-top-4 duration-500',
  slideLeft: 'animate-in slide-in-from-right-4 duration-500',
  slideRight: 'animate-in slide-in-from-left-4 duration-500',
  zoomIn: 'animate-in zoom-in-95 duration-300',
  zoomOut: 'animate-out zoom-out-95 duration-200',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  wiggle: 'animate-wiggle'
}

export const createConfetti = (count = 50, container = document.body) => {
  const colors = ['#FFD93D', '#FF6B6B', '#4ECDC4', '#95E1D3', '#6B73FF', '#9B59B6', '#2ECC71', '#FF8C42']
  const shapes = ['circle', 'square', 'triangle']
  
  const confettiElements = []
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div')
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = Math.random() * 10 + 5
    const left = Math.random() * 100
    const animationDuration = Math.random() * 3 + 2
    const delay = Math.random() * 0.5
    
    confetti.style.cssText = `
      position: fixed;
      left: ${left}%;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      opacity: 0.8;
      z-index: 9999;
      pointer-events: none;
      animation: confettiFall ${animationDuration}s ease-in ${delay}s forwards;
      ${shape === 'circle' ? 'border-radius: 50%;' : ''}
      ${shape === 'triangle' ? 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);' : ''}
    `
    
    container.appendChild(confetti)
    confettiElements.push(confetti)
  }
  
  setTimeout(() => {
    confettiElements.forEach(el => el.remove())
  }, 5000)
  
  return confettiElements
}

export const createFireworks = (x, y, container = document.body) => {
  const colors = ['#FFD93D', '#FF6B6B', '#4ECDC4', '#6B73FF']
  const particles = 30
  
  for (let i = 0; i < particles; i++) {
    const particle = document.createElement('div')
    const angle = (Math.PI * 2 * i) / particles
    const velocity = Math.random() * 100 + 50
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 4px;
      height: 4px;
      background: ${color};
      border-radius: 50%;
      z-index: 9999;
      pointer-events: none;
      animation: firework 1s ease-out forwards;
      --tx: ${Math.cos(angle) * velocity}px;
      --ty: ${Math.sin(angle) * velocity}px;
    `
    
    container.appendChild(particle)
    setTimeout(() => particle.remove(), 1000)
  }
}

export const createSparkles = (element) => {
  const rect = element.getBoundingClientRect()
  const sparkleCount = 8
  
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div')
    const x = rect.left + Math.random() * rect.width
    const y = rect.top + Math.random() * rect.height
    
    sparkle.innerHTML = '✨'
    sparkle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${Math.random() * 20 + 10}px;
      z-index: 9999;
      pointer-events: none;
      animation: sparkle 1s ease-out forwards;
    `
    
    document.body.appendChild(sparkle)
    setTimeout(() => sparkle.remove(), 1000)
  }
}

export const createRipple = (x, y, color = '#6B73FF') => {
  const ripple = document.createElement('div')
  
  ripple.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: ${color};
    opacity: 0.5;
    z-index: 9999;
    pointer-events: none;
    animation: ripple 0.6s ease-out forwards;
  `
  
  document.body.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
}

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes confettiFall {
      to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    @keyframes firework {
      to {
        transform: translate(var(--tx), var(--ty));
        opacity: 0;
      }
    }
    
    @keyframes sparkle {
      0% { transform: scale(0) rotate(0deg); opacity: 1; }
      50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
      100% { transform: scale(0) rotate(360deg); opacity: 0; }
    }
    
    @keyframes ripple {
      to {
        width: 200px;
        height: 200px;
        margin-left: -100px;
        margin-top: -100px;
        opacity: 0;
      }
    }
    
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    
    .animate-wiggle {
      animation: wiggle 0.5s ease-in-out infinite;
    }
  `
  document.head.appendChild(style)
}
