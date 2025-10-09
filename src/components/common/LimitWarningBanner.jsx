import { Lock, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function LimitWarningBanner({ limit, feature, current }) {
  const navigate = useNavigate()
  
  return (
    <div className="card p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-orange-600" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900">Free Limit Reached</p>
            <p className="text-gray-700">
              You've reached {current || limit} {feature}. Upgrade to Premium for unlimited access.
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/premium')} 
          className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
        >
          <Crown size={16} />
          Upgrade
        </button>
      </div>
    </div>
  )
}

export default LimitWarningBanner
