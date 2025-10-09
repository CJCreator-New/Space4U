import { useState } from 'react'
import { X, AlertCircle, Phone, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Disclaimer from '../common/Disclaimer'

const ASSESSMENTS = {
  phq9: {
    name: 'PHQ-9 (Depression)',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling/staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself or that you are a failure',
      'Trouble concentrating on things',
      'Moving or speaking slowly, or being fidgety/restless',
      'Thoughts that you would be better off dead or hurting yourself'
    ],
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    severity: [
      { max: 4, level: 'minimal', color: 'green' },
      { max: 9, level: 'mild', color: 'yellow' },
      { max: 14, level: 'moderate', color: 'orange' },
      { max: 19, level: 'moderately severe', color: 'red' },
      { max: 27, level: 'severe', color: 'red' }
    ]
  },
  gad7: {
    name: 'GAD-7 (Anxiety)',
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it\'s hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen'
    ],
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    severity: [
      { max: 4, level: 'minimal', color: 'green' },
      { max: 9, level: 'mild', color: 'yellow' },
      { max: 14, level: 'moderate', color: 'orange' },
      { max: 21, level: 'severe', color: 'red' }
    ]
  }
}

function MentalHealthAssessments({ onClose }) {
  const { user } = useAuth()
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [responses, setResponses] = useState([])
  const [result, setResult] = useState(null)

  const startAssessment = (type) => {
    setSelectedAssessment(type)
    setResponses(new Array(ASSESSMENTS[type].questions.length).fill(null))
    setResult(null)
  }

  const calculateScore = () => {
    const total = responses.reduce((sum, val) => sum + (val || 0), 0)
    const assessment = ASSESSMENTS[selectedAssessment]
    const severity = assessment.severity.find(s => total <= s.max)
    setResult({ total, severity: severity.level, color: severity.color })
  }

  const handleSave = async () => {
    const data = {
      assessment_type: selectedAssessment,
      responses,
      total_score: result.total,
      severity_level: result.severity
    }

    if (user) {
      console.log('Saving to database:', data)
    } else {
      const saved = JSON.parse(localStorage.getItem('safespace_assessments') || '[]')
      saved.push({ ...data, id: Date.now(), created_at: new Date().toISOString() })
      localStorage.setItem('safespace_assessments', JSON.stringify(saved))
    }
    onClose()
  }

  if (result) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-2xl max-w-lg w-full p-8">
          <div className="text-center mb-6">
            <div className={`w-20 h-20 rounded-full bg-${result.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
              <span className="text-4xl font-bold">{result.total}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Assessment Complete</h3>
            <p className="text-text-secondary capitalize">Severity: {result.severity}</p>
          </div>

          <div className="card p-4 bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Important Note</p>
                <p className="text-text-secondary">This is a screening tool, not a diagnosis. Please consult a mental health professional for proper evaluation.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setResult(null)} className="btn-secondary flex-1">Retake</button>
            <button onClick={handleSave} className="btn-primary flex-1">Save Results</button>
          </div>
        </div>
      </div>
    )
  }

  if (selectedAssessment) {
    const assessment = ASSESSMENTS[selectedAssessment]
    const isComplete = responses.every(r => r !== null)

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{assessment.name}</h2>
              <p className="text-sm text-text-secondary">Over the last 2 weeks, how often have you been bothered by:</p>
            </div>
            <button onClick={() => setSelectedAssessment(null)} className="p-2 hover:bg-hover rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {assessment.questions.map((question, i) => (
              <div key={i} className="card p-4">
                <p className="font-medium mb-3">{i + 1}. {question}</p>
                <div className="space-y-2">
                  {assessment.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => {
                        const newResponses = [...responses]
                        newResponses[i] = optionIndex
                        setResponses(newResponses)
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        responses[i] === optionIndex
                          ? 'bg-primary text-white'
                          : 'bg-hover hover:bg-hover/80'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-surface border-t border-border p-6">
            <button
              onClick={calculateScore}
              disabled={!isComplete}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calculate Score
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mental Health Assessments</h2>
            <p className="text-sm text-text-secondary mt-1">Validated screening tools for self-assessment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <Disclaimer type="assessment" />
          
          {/* Crisis Warning */}
          <div className="card p-4 bg-red-50 border border-red-200 mb-6">
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1 text-gray-900">Crisis Support Available 24/7</p>
                <p className="text-gray-700 mb-2">If you're having thoughts of self-harm or suicide, please call 988 immediately.</p>
                <a href="tel:988" className="text-red-600 hover:text-red-700 font-medium">Call 988 - Suicide & Crisis Lifeline</a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(ASSESSMENTS).map(([key, assessment]) => (
              <button
                key={key}
                onClick={() => startAssessment(key)}
                className="card p-6 w-full text-left hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{assessment.name}</h3>
                    <p className="text-text-secondary text-sm mb-3">{assessment.questions.length} questions • 2-3 minutes</p>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Shield size={14} />
                      <span>Clinically validated screening tool</span>
                    </div>
                  </div>
                  <div className="text-primary text-2xl">→</div>
                </div>
              </button>
            ))}
          </div>

          {/* Professional Help Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-700">
              <strong>Remember:</strong> These assessments are screening tools only. For diagnosis and treatment, please consult with a licensed mental health professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentalHealthAssessments
