import { BookOpen } from 'lucide-react'
import EvidenceBadge from './EvidenceBadge'

function ResearchCard({ citations, title = "Research Support" }) {
  if (!citations || citations.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {citations.map((citation, index) => (
          <div key={index} className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-sm font-medium text-gray-900">
                {citation.authors} ({citation.year})
              </p>
              <EvidenceBadge level={citation.evidenceLevel} />
            </div>
            <p className="text-sm text-gray-700">{citation.finding}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResearchCard
