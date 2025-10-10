import { Globe, Check } from 'lucide-react'
import { useState } from 'react'
import { COUNTRIES } from '../../data/countryData'
import ProgressIndicator from './ProgressIndicator'

function CountryStep({ data, onNext, onBack, step, totalSteps }) {
  const [selectedCountry, setSelectedCountry] = useState(data.country || 'US')

  const handleContinue = () => {
    onNext({ country: selectedCountry })
  }

  return (
    <div className="p-8">
      <ProgressIndicator current={step} total={totalSteps} />
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Select Your Country</h2>
        <p className="text-text-secondary">
          This helps us show you relevant crisis helplines and emergency numbers
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {Object.values(COUNTRIES).map((country) => (
          <button
            key={country.code}
            onClick={() => setSelectedCountry(country.code)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
              selectedCountry === country.code
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{country.flag}</span>
              <div className="text-left">
                <p className="font-semibold">{country.name}</p>
                <p className="text-xs text-text-secondary">Emergency: {country.emergency}</p>
              </div>
            </div>
            {selectedCountry === country.code && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} className="btn-secondary flex-1">
            Back
          </button>
        )}
        <button onClick={handleContinue} className="btn-primary flex-1">
          Continue
        </button>
      </div>
    </div>
  )
}

export default CountryStep
