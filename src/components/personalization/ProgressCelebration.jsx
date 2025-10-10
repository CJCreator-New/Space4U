import { useEffect, useState } from 'react'
import { Sparkles, Trophy, Star, Heart } from 'lucide-react'

function ProgressCelebration({ achievement, onClose }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      onClose?.()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!show) return null

  const icons = { sparkles: Sparkles, trophy: Trophy, star: Star, heart: Heart }
  const Icon = icons[achievement.icon] || Trophy

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#FFD93D', '#FF6B6B', '#4ECDC4', '#95E1D3', '#6B73FF'][Math.floor(Math.random() * 5)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Achievement card */}
      <div className="pointer-events-auto animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
            <Icon className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {achievement.title}
          </h2>
          
          <p className="text-text-secondary mb-4">{achievement.description}</p>
          
          {achievement.reward && (
            <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-primary">{achievement.reward}</p>
            </div>
          )}

          <button onClick={() => { setShow(false); onClose?.(); }} className="btn-primary">
            Awesome!
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProgressCelebration
