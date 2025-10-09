import { AlertTriangle, Phone, ExternalLink } from 'lucide-react'

function Disclaimer({ type = 'general' }) {
  const disclaimers = {
    general: {
      title: 'Important Notice',
      icon: AlertTriangle,
      color: 'blue',
      content: 'This tool is designed to support your mental wellness journey, not replace professional care. If you\'re experiencing a mental health crisis, please contact a professional immediately.'
    },
    assessment: {
      title: 'Screening Tool Disclaimer',
      icon: AlertTriangle,
      color: 'yellow',
      content: 'This is a screening tool, not a diagnostic instrument. Results should be discussed with a qualified mental health professional. These assessments cannot replace a clinical evaluation.'
    },
    crisis: {
      title: 'Crisis Support',
      icon: Phone,
      color: 'red',
      content: 'If you\'re in immediate danger or having thoughts of self-harm, please call emergency services (911) or the National Suicide Prevention Lifeline at 988 immediately.'
    },
    therapy: {
      title: 'Therapeutic Tool Notice',
      icon: AlertTriangle,
      color: 'purple',
      content: 'These evidence-based techniques are most effective when used alongside professional therapy. They are educational tools to support your mental health journey.'
    }
  }

  const disclaimer = disclaimers[type]
  const Icon = disclaimer.icon

  return (
    <div className={`card p-4 bg-${disclaimer.color}-50 border border-${disclaimer.color}-200 mb-6`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 text-${disclaimer.color}-600 flex-shrink-0 mt-0.5`} />
        <div className="text-sm">
          <p className="font-semibold mb-1 text-gray-900">{disclaimer.title}</p>
          <p className="text-gray-700 mb-3">{disclaimer.content}</p>
          
          {type === 'crisis' && (
            <div className="space-y-2">
              <a href="tel:988" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                <Phone size={16} />
                <span>Call 988 - Suicide & Crisis Lifeline</span>
              </a>
              <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                <ExternalLink size={16} />
                <span>Visit 988lifeline.org</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Disclaimer
