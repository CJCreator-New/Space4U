import { useState } from 'react'
import { useHaptic } from '../../hooks/useHaptic'

function MicroInteraction({ children, type = 'scale', haptic = true, onClick, className = '' }) {
  const [isActive, setIsActive] = useState(false)
  const { triggerHaptic } = useHaptic()

  const animations = {
    scale: 'active:scale-95',
    bounce: 'active:scale-110',
    press: 'active:opacity-70',
    lift: 'active:-translate-y-1'
  }

  const handleClick = (e) => {
    if (haptic) triggerHaptic('light')
    setIsActive(true)
    setTimeout(() => setIsActive(false), 150)
    onClick?.(e)
  }

  return (
    <div
      className={`transition-all duration-150 ${animations[type]} ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

export default MicroInteraction
