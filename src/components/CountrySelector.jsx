import { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { COUNTRIES, saveUserCountry, getUserCountry } from '../data/countryData'

function CountrySelector({ onCountryChange }) {
  const [selectedCountry, setSelectedCountry] = useState(getUserCountry())
  const [showModal, setShowModal] = useState(false)

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode)
    saveUserCountry(countryCode)
    setShowModal(false)
    if (onCountryChange) onCountryChange(countryCode)
  }

  const currentCountry = COUNTRIES[selectedCountry]

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-hover transition-colors"
      >
        <Globe className="w-5 h-5 text-text-secondary" />
        <span className="text-2xl">{currentCountry.flag}</span>
        <span className="text-sm font-medium">{currentCountry.name}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Select Your Country</h2>
            <p className="text-text-secondary text-sm mb-6">
              This helps us show you relevant crisis helplines and emergency numbers
            </p>
            
            <div className="space-y-3">
              {Object.values(COUNTRIES).map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country.code)}
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

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-hover transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CountrySelector
