import { TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react'

function InsightCard({ insight }) {
  const trendIcons = {
    up: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    down: { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50' },
    stable: { icon: Minus, color: 'text-blue-500', bg: 'bg-blue-50' }
  }

  const trend = trendIcons[insight.trend] || trendIcons.stable
  const TrendIcon = trend.icon

  return (
    <div className="card p-6 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${trend.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <TrendIcon className={`w-6 h-6 ${trend.color}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold">{insight.title}</h3>
            {insight.confidence && (
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {insight.confidence}% confident
              </span>
            )}
          </div>
          
          <p className="text-sm text-text-secondary mb-3">{insight.description}</p>
          
          {insight.suggestions && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Lightbulb className="w-4 h-4" />
                <span>What you can do:</span>
              </div>
              <ul className="space-y-1">
                {insight.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insight.action && (
            <button onClick={insight.action.onClick} className="btn-primary text-sm mt-3">
              {insight.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InsightCard
