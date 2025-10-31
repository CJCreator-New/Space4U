import { useNavigate } from 'react-router-dom'
import { HeroCrown, Lock, Sparkles } from '../config/icons'

function PremiumPaywall({ feature, description, children }) {
  const navigate = useNavigate()
  const premiumData = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
  const isPremium = premiumData.isPremium || false

  if (isPremium) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div className="filter blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeroCrown className="text-white" size={32} />
          </div>
          
          <h3 className="text-2xl font-bold text-text-primary mb-2 font-secondary">
            Premium Feature
          </h3>
          
          <p className="text-text-secondary mb-6">
            {description || `Unlock ${feature} with Premium`}
          </p>
          
          <button
            onClick={() => navigate('/premium')}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Sparkles size={20} />
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  )
}

export default PremiumPaywall

