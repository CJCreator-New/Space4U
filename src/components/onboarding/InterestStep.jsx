import { useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator'

const interests = [
  { id: 'anxiety', label: 'Anxiety & Stress', icon: '😰' },
  { id: 'depression', label: 'Depression & Mood', icon: '💙' },
  { id: 'work', label: 'Work & Career', icon: '💼' },
  { id: 'relationships', label: 'Relationships', icon: '💕' },
  { id: 'academic', label: 'Academic Pressure', icon: '📚' },
  { id: 'lgbtq', label: 'LGBTQ+ Support', icon: '🏳️‍🌈' },
  { id: 'sleep', label: 'Sleep Issues', icon: '😴' },
  { id: 'wellness', label: 'General Wellness', icon: '🌱' },
]

function InterestStep({ data, onNext, onBack, onSkip }) {
  const [selectedInterests, setSelectedInterests] = useState(data.interests || [])

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleSubmit = () => {
    if (selectedInterests.length > 0) {
      onNext({ interests: selectedInterests })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <button onClick={onSkip} className="text-text-secondary text-sm">Skip</button>
      </div>

      <ProgressIndicator current={3} total={4} />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">What brings you here?</h2>
        <p className="text-text-secondary text-sm">Select all that apply - this helps us show relevant communities</p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {interests.map((interest) => (
          <button
            key={interest.id}
            onClick={() => toggleInterest(interest.id)}
            className={`flex items-center p-4 rounded-2xl border-2 transition-all ${
              selectedInterests.includes(interest.id)
                ? 'bg-primary/10 border-primary'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl mr-3">{interest.icon}</span>
            <span className="flex-1 text-left font-medium">{interest.label}</span>
            {selectedInterests.includes(interest.id) && (
              <Check size={20} className="text-primary" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedInterests.length === 0}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
          selectedInterests.length > 0
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  )
}

export default InterestStep