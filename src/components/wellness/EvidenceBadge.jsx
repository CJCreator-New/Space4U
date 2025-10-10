import { CheckCircle, Circle } from 'lucide-react'
import { evidenceLevels } from '../../data/researchCitations'

const colorMap = {
  green: 'bg-green-100 text-green-800 border-green-300',
  blue: 'bg-blue-100 text-blue-800 border-blue-300',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  gray: 'bg-gray-100 text-gray-800 border-gray-300'
}

function EvidenceBadge({ level, showDescription = false }) {
  const evidence = evidenceLevels[level]
  if (!evidence) return null

  const Icon = level === 'strong' ? CheckCircle : Circle
  const colorClass = colorMap[evidence.color]

  return (
    <div className="inline-flex flex-col gap-1">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
        <Icon className="w-3.5 h-3.5" />
        {evidence.label}
      </span>
      {showDescription && (
        <span className="text-xs text-text-secondary">{evidence.description}</span>
      )}
    </div>
  )
}

export default EvidenceBadge
