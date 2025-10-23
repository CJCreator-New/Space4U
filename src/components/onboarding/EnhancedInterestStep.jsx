import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator'

const interestGroups = {
  'Mental Health': [
    { id: 'anxiety', label: 'Anxiety & Stress', icon: '😰' },
    { id: 'depression', label: 'Depression & Mood', icon: '💙' },
    { id: 'sleep', label: 'Sleep Issues', icon: '😴' },
  ],
  'Life Areas': [
    { id: 'work', label: 'Work & Career', icon: '💼' },
    { id: 'relationships', label: 'Relationships', icon: '💕' },
    { id: 'academic', label: 'Academic Pressure', icon: '📚' },
  ],
  'Community': [
    { id: 'lgbtq', label: 'LGBTQ+ Support', icon: '🏳️‍🌈' },
    { id: 'wellness', label: 'General Wellness', icon: '🌱' },
  ]
}

function EnhancedInterestStep({ data, onNext, onBack, onSkip }) {
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
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={onSkip}
          className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
        >
          Skip
        </button>
      </div>

      <ProgressIndicator current={3} total={4} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What brings you here?</h2>
        <p className="text-gray-600 text-sm">Select all that apply - this helps us show relevant communities</p>
      </motion.div>

      <div className="space-y-6 mb-8 max-h-96 overflow-y-auto">
        {Object.entries(interestGroups).map(([groupName, interests]) => (
          <div key={groupName}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{groupName}</h3>
            <div className="space-y-2">
              {interests.map((interest) => (
                <motion.button
                  key={interest.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleInterest(interest.id)}
                  className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                    selectedInterests.includes(interest.id)
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  role="checkbox"
                  aria-checked={selectedInterests.includes(interest.id)}
                  aria-label={interest.label}
                >
                  <span className="text-2xl mr-3" aria-hidden="true">{interest.icon}</span>
                  <span className="flex-1 text-left font-medium text-gray-800">{interest.label}</span>
                  {selectedInterests.includes(interest.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <Check size={20} className="text-blue-600" aria-hidden="true" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: selectedInterests.length > 0 ? 1.02 : 1 }}
        whileTap={{ scale: selectedInterests.length > 0 ? 0.98 : 1 }}
        onClick={handleSubmit}
        disabled={selectedInterests.length === 0}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          selectedInterests.length > 0
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-disabled={selectedInterests.length === 0}
      >
        Continue {selectedInterests.length > 0 && `(${selectedInterests.length} selected)`}
      </motion.button>
    </div>
  )
}

export default EnhancedInterestStep
