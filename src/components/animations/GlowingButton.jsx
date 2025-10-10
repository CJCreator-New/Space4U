import { useState } from 'react'
import { createRipple, createSparkles } from '../../utils/animations'

function GlowingButton({ children, onClick, variant = 'primary', className = '', ...props }) {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600',
    success: 'bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600',
    danger: 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600'
  }

  const handleClick = (e) => {
    createRipple(e.clientX, e.clientY)
    createSparkles(e.currentTarget)
    onClick?.(e)
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden
        ${variants[variant]}
        text-white font-semibold
        px-6 py-3 rounded-xl
        shadow-lg hover:shadow-2xl
        transform hover:scale-105
        transition-all duration-300
        ${isHovered ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {isHovered && (
        <span className="absolute inset-0 bg-white opacity-20 animate-ping" />
      )}
    </button>
  )
}

export default GlowingButton
