import { Phone, MessageSquare, AlertCircle } from 'lucide-react'
import { getCountryData, getUserCountry } from '../../data/countryData'
import { useState, useEffect } from 'react'

function CrisisResources({ compact = false }) {
  const [countryCode, setCountryCode] = useState(getUserCountry())
  const countryData = getCountryData(countryCode)

  useEffect(() => {
    const handleCountryChange = () => setCountryCode(getUserCountry())
    window.addEventListener('countryChanged', handleCountryChange)
    return () => window.removeEventListener('countryChanged', handleCountryChange)
  }, [])
  if (compact) {
    const primaryHelpline = countryData.crisisHelplines[0]
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 text-sm mb-1">In Crisis? {countryData.flag}</h3>
            <p className="text-sm text-red-800 mb-2">{primaryHelpline.name}</p>
            <a href={`tel:${primaryHelpline.phone}`} className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              <Phone className="w-4 h-4" />
              {primaryHelpline.phone}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <h3 className="font-bold text-red-900 text-lg">Crisis Resources {countryData.flag}</h3>
      </div>
      <p className="text-red-800 mb-4">If you're in crisis or need immediate help, please reach out:</p>
      <div className="space-y-3">
        {countryData.crisisHelplines.map((helpline, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border-2 border-red-300">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">{helpline.name}</p>
                <p className="text-sm text-red-700 mb-2">{helpline.description}</p>
                <div className="flex flex-wrap gap-2">
                  {helpline.phone && (
                    <a href={`tel:${helpline.phone}`} className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      <Phone className="w-3 h-3" />
                      {helpline.phone}
                    </a>
                  )}
                  {helpline.text && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                      <MessageSquare className="w-3 h-3" />
                      {helpline.text}
                    </span>
                  )}
                </div>
                <p className="text-xs text-red-600 mt-2">{helpline.hours} • {helpline.languages}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-lg p-4 border-2 border-red-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Emergency Services</p>
              <p className="text-sm text-red-700">Call {countryData.emergency} for immediate emergency assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrisisResources
