import { Heart, Sparkles } from 'lucide-react'

function Logo({ size = 'md', showText = true, variant = 'default' }) {
  const sizes = {
    xs: { container: 'w-8 h-8', icon: 16, text: 'text-sm' },
    sm: { container: 'w-12 h-12', icon: 20, text: 'text-base' },
    md: { container: 'w-16 h-16', icon: 28, text: 'text-xl' },
    lg: { container: 'w-24 h-24', icon: 40, text: 'text-3xl' },
    xl: { container: 'w-32 h-32', icon: 56, text: 'text-4xl' }
  }

  const s = sizes[size]

  const variants = {
    default: 'bg-gradient-to-br from-primary via-purple-500 to-pink-500',
    light: 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400',
    dark: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
    minimal: 'bg-primary'
  }

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className={`${s.container} ${variants[variant]} rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden group`}>
        {/* Animated background */}
        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-300" />
        
        {/* Main icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Heart 
            size={s.icon} 
            className="text-white fill-white/80 group-hover:scale-110 transition-transform duration-300" 
          />
          <Sparkles 
            size={s.icon * 0.5} 
            className="text-white absolute -top-1 -right-1 group-hover:rotate-12 transition-transform duration-300" 
          />
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${s.text} font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            Space4U
          </h1>
          <p className="text-xs text-text-secondary -mt-1">Your mental wellness space</p>
        </div>
      )}
    </div>
  )
}

export default Logo
