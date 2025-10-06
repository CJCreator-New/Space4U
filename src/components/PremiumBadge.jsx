import { Crown } from 'lucide-react'
import { checkPremiumStatus } from '../utils/premiumManager'

function PremiumBadge({ size = 'sm' }) {
  const { isPremium, trialActive } = checkPremiumStatus()
  
  if (!isPremium && !trialActive) return null

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <div className={`inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-medium ${sizeClasses[size]}`}>
      <Crown size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      <span>{trialActive ? 'Trial' : 'Premium'}</span>
    </div>
  )
}

export default PremiumBadge
