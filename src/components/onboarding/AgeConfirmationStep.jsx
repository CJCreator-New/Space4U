import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator'

function AgeConfirmationStep({ data, onNext, onBack }) {
  const [ageConfirmed, setAgeConfirmed] = useState(data.ageConfirmed || false)

  const handleSubmit = () => {
    if (ageConfirmed) {
      onNext({ ageConfirmed })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
      </div>

      <ProgressIndicator current={4} total={4} />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">One last thing</h2>
      </div>

      <div className="mb-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ageConfirmed}
            onChange={(e) => setAgeConfirmed(e.target.checked)}
            className="mt-1 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary"
          />
          <span className="text-text-primary font-medium">
            I confirm I am 18 years or older
          </span>
        </label>
      </div>

      <div className="bg-amber-50 border border-warning/20 rounded-2xl p-4 mb-8">
        <p className="text-sm text-text-secondary leading-relaxed">
          space4u is designed for adults. If you're under 18, please speak with a trusted adult or contact a youth helpline for support.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!ageConfirmed}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
          ageConfirmed
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Complete Setup
      </button>
    </div>
  )
}

export default AgeConfirmationStep
