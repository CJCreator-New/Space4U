import { AlertTriangle, Info, Shield, Activity } from 'lucide-react'
import { useState } from 'react'

const iconMap = {
  general: Info,
  educational: Activity,
  clinical: Shield,
  measurement: Activity,
  medical: AlertTriangle
}

const colorMap = {
  general: 'bg-blue-50 border-blue-200 text-blue-800',
  educational: 'bg-purple-50 border-purple-200 text-purple-800',
  clinical: 'bg-orange-50 border-orange-200 text-orange-800',
  measurement: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  medical: 'bg-red-50 border-red-200 text-red-800'
}

function DisclaimerBanner({ disclaimer, collapsible = true }) {
  const [isExpanded, setIsExpanded] = useState(!collapsible)
  const Icon = iconMap[disclaimer.type] || Info
  const colorClass = colorMap[disclaimer.type] || colorMap.general

  return (
    <div className={`rounded-xl border-2 p-4 ${colorClass}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{disclaimer.title}</h3>
            {collapsible && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs underline hover:no-underline"
              >
                {isExpanded ? 'Hide' : 'Read More'}
              </button>
            )}
          </div>
          {isExpanded && (
            <p className="text-sm mt-2 leading-relaxed">{disclaimer.content}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DisclaimerBanner
