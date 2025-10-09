import { Crown } from 'lucide-react'

function PremiumFeatureCard({ title, description, icon: Icon, locked, onClick }) {
  return (
    <div 
      className={`card p-6 ${locked ? 'opacity-60 cursor-pointer hover:opacity-80' : ''} transition-all`}
      onClick={locked ? onClick : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-primary" />
        {locked && <Crown className="w-5 h-5 text-yellow-500" />}
      </div>
      <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
      {locked && (
        <div className="mt-3 text-xs text-yellow-600 font-medium">Premium Feature</div>
      )}
    </div>
  )
}

export default PremiumFeatureCard
