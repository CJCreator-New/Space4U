import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Check, Search, ArrowLeft } from 'lucide-react'
import * as Label from '@radix-ui/react-label'
import { COUNTRIES } from '../../data/countryData'
import ProgressIndicator from './ProgressIndicator'

function EnhancedCountryStep({ data, onNext, onBack, step, totalSteps }) {
  const [selectedCountry, setSelectedCountry] = useState(data.country || 'US')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCountries = Object.values(COUNTRIES).filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleContinue = () => {
    onNext({ country: selectedCountry })
  }

  return (
    <div className="p-8">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <ProgressIndicator current={step} total={totalSteps} />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-blue-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Country</h2>
        <p className="text-gray-600 text-sm">
          This helps us show you relevant crisis helplines and emergency numbers
        </p>
      </motion.div>

      <div className="mb-4">
        <Label.Root htmlFor="country-search" className="sr-only">
          Search countries
        </Label.Root>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            id="country-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search countries..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            aria-label="Search for your country"
          />
        </div>
      </div>

      <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
        {filteredCountries.map((country) => (
          <motion.button
            key={country.code}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedCountry(country.code)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              selectedCountry === country.code
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            aria-pressed={selectedCountry === country.code}
            role="radio"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{country.flag}</span>
              <div className="text-left">
                <p className="font-semibold text-gray-800">{country.name}</p>
                <p className="text-xs text-gray-500">Emergency: {country.emergency}</p>
              </div>
            </div>
            {selectedCountry === country.code && (
              <Check className="w-5 h-5 text-blue-600" aria-hidden="true" />
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleContinue}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        Continue
      </motion.button>
    </div>
  )
}

export default EnhancedCountryStep
