import { useState } from 'react'
import { Sparkles } from 'lucide-react'

function AnimatedCard({ children, gradient = 'from-indigo-500 to-purple-600', glow = true, className = '' }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group
        bg-white rounded-2xl
        shadow-lg hover:shadow-2xl
        transform hover:-translate-y-2
        transition-all duration-500
        overflow-hidden
        ${className}
      `}
    >
      {/* Gradient border effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} style={{ padding: '2px' }}>
        <div className="bg-white rounded-2xl h-full w-full" />
      </div>

      {/* Glow effect */}
      {glow && isHovered && (
        <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-30 blur-xl animate-pulse`} />
      )}

      {/* Sparkle effect */}
      {isHovered && (
        <div className="absolute top-2 right-2 animate-spin-slow">
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Shine effect */}
      <div className={`
        absolute inset-0 
        bg-gradient-to-r from-transparent via-white to-transparent
        opacity-0 group-hover:opacity-30
        transform -translate-x-full group-hover:translate-x-full
        transition-all duration-1000
      `} />
    </div>
  )
}

export default AnimatedCard
