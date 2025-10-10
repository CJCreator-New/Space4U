import { useState } from 'react'
import { Sparkles, TrendingUp, Zap, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function SmartCard({ feature, isRecommended, isActive, priority, onDismiss }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const priorityStyles = {
    urgent: 'border-2 border-red-400 shadow-lg shadow-red-100',
    high: 'border-2 border-primary shadow-lg shadow-primary/20',
    medium: 'border border-primary/30',
    low: 'border border-gray-200'
  }

  const priorityBadges = {
    urgent: { icon: Sparkles, text: 'Needs Attention', color: 'bg-red-500' },
    high: { icon: TrendingUp, text: 'Recommended', color: 'bg-primary' },
    medium: { icon: Zap, text: 'Quick Win', color: 'bg-yellow-500' },
    low: null
  }

  const badge = priorityBadges[priority]
  const Icon = feature.icon

  return (
    <div className={`card p-6 hover:shadow-xl transition-all relative ${priorityStyles[priority]} ${isActive ? 'ring-2 ring-primary' : ''}`}>
      {badge && (
        <div className={`absolute -top-2 -right-2 ${badge.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg`}>
          <badge.icon className="w-3 h-3" />
          <span>{badge.text}</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient || 'from-primary to-purple-500'} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{feature.name}</h3>
            {feature.subtitle && <p className="text-xs text-text-secondary">{feature.subtitle}</p>}
          </div>
        </div>
        
        {onDismiss && (
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-hover rounded">
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>

      {feature.description && (
        <p className="text-sm text-text-secondary mb-4">{feature.description}</p>
      )}

      {feature.stats && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {feature.stats.map((stat, i) => (
            <div key={i} className="bg-hover rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => navigate(feature.path)} className="btn-primary flex-1 text-sm">
          {feature.action || 'Open'}
        </button>
        {feature.secondaryAction && (
          <button onClick={feature.secondaryAction.onClick} className="btn-secondary text-sm">
            {feature.secondaryAction.label}
          </button>
        )}
      </div>

      {showMenu && onDismiss && (
        <div className="absolute top-12 right-4 bg-white shadow-xl rounded-lg p-2 z-10 border">
          <button onClick={() => { onDismiss(); setShowMenu(false); }} className="text-sm px-3 py-2 hover:bg-hover rounded w-full text-left">
            Not interested
          </button>
        </div>
      )}
    </div>
  )
}

export default SmartCard
