import { useEffect, useState } from 'react'
import { CheckCircle, Star, Heart, Trophy } from 'lucide-react'
import ConfettiExplosion from './ConfettiExplosion'

function SuccessAnimation({ show, message, icon = 'check', onClose }) {
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    if (show) {
      setConfetti(true)
      const timer = setTimeout(() => {
        onClose?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const icons = {
    check: CheckCircle,
    star: Star,
    heart: Heart,
    trophy: Trophy
  }

  const Icon = icons[icon] || CheckCircle

  return (
    <>
      <ConfettiExplosion active={confetti} onComplete={() => setConfetti(false)} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl animate-in zoom-in-95 duration-500">
          {/* Animated icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center animate-bounce">
              <Icon className="w-12 h-12 text-white" />
            </div>
            
            {/* Pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-400 rounded-full opacity-20 animate-ping" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-green-400 rounded-full opacity-10 animate-ping animation-delay-150" />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Success!
          </h2>
          <p className="text-gray-600 text-lg">{message}</p>

          {/* Sparkles */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                ✨
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SuccessAnimation
