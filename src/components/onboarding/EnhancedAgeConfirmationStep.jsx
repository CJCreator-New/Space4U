import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Phone, ExternalLink } from 'lucide-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Label from '@radix-ui/react-label'
import ProgressIndicator from './ProgressIndicator'

const youthResources = [
  { name: 'Crisis Text Line', contact: 'Text HOME to 741741', url: 'https://www.crisistextline.org' },
  { name: 'Teen Line', contact: '1-800-852-8336', url: 'https://teenlineonline.org' },
  { name: 'SAMHSA Youth Helpline', contact: '1-800-662-4357', url: 'https://www.samhsa.gov' }
]

function EnhancedAgeConfirmationStep({ data, onNext, onBack }) {
  const [ageConfirmed, setAgeConfirmed] = useState(data.ageConfirmed || false)

  const handleSubmit = () => {
    if (ageConfirmed) {
      onNext({ ageConfirmed })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <ProgressIndicator current={4} total={4} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">One last thing</h2>
        <p className="text-gray-600 text-sm">We need to confirm your age for safety</p>
      </motion.div>

      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <Checkbox.Root
            checked={ageConfirmed}
            onCheckedChange={setAgeConfirmed}
            className="mt-1 w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center focus:ring-2 focus:ring-blue-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all"
            id="age-confirm"
            aria-required="true"
          >
            <Checkbox.Indicator>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M11.5 3.5L6 9L3.5 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </Checkbox.Indicator>
          </Checkbox.Root>
          <Label.Root htmlFor="age-confirm" className="text-gray-800 font-medium cursor-pointer">
            I confirm I am 18 years or older
          </Label.Root>
        </label>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Under 18?</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Space4U is designed for adults. If you're under 18, please speak with a trusted adult or contact a youth helpline for support.
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700 mb-2">Youth Support Resources:</p>
          {youthResources.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{resource.name}</p>
                <p className="text-xs text-gray-600">{resource.contact}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
            </a>
          ))}
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: ageConfirmed ? 1.02 : 1 }}
        whileTap={{ scale: ageConfirmed ? 0.98 : 1 }}
        onClick={handleSubmit}
        disabled={!ageConfirmed}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          ageConfirmed
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-disabled={!ageConfirmed}
      >
        Complete Setup
      </motion.button>
    </div>
  )
}

export default EnhancedAgeConfirmationStep
