import { useState } from 'react'
import { Phone, MessageCircle, AlertCircle, X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function CrisisSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const { t, i18n } = useTranslation()

  const crisisResources = {
    en: [
      {
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        description: '24/7 free and confidential support for people in distress',
        type: 'call',
        country: 'USA'
      },
      {
        name: 'Crisis Text Line',
        phone: '741741',
        description: 'Text HOME to 741741 for free 24/7 crisis support',
        type: 'text',
        country: 'USA'
      },
      {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        description: 'Treatment referral and information service',
        type: 'call',
        country: 'USA'
      },
      {
        name: 'International Association for Suicide Prevention',
        url: 'https://www.iasp.info/resources/Crisis_Centres/',
        description: 'Find crisis centers worldwide',
        type: 'web',
        country: 'International'
      }
    ]
  }

  const resources = crisisResources[i18n.language] || crisisResources.en

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`
  }

  const handleText = (phone) => {
    window.location.href = `sms:${phone}`
  }

  const handleWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Crisis Button - Always Visible */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-2xl transition-colors focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
        aria-label="Crisis Support - Get immediate help"
        title="Need immediate help? Click here"
      >
        <div className="flex items-center gap-2">
          <AlertCircle size={24} className="animate-pulse" />
          <span className="hidden md:inline font-semibold">Crisis Support</span>
        </div>
      </motion.button>

      {/* Crisis Support Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-red-600 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={28} />
                    <div>
                      <h2 className="text-xl font-bold">Crisis Support</h2>
                      <p className="text-sm text-red-100">You're not alone. Help is available 24/7</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-red-700 rounded-full transition-colors"
                    aria-label="Close crisis support"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Emergency Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-yellow-900 dark:text-yellow-200">
                    <strong>If you're in immediate danger:</strong> Call emergency services (911 in USA, 112 in EU, 000 in Australia) or go to your nearest emergency room.
                  </p>
                </div>

                {/* Resources List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-text-primary dark:text-white mb-3">
                    Available Resources
                  </h3>

                  {resources.map((resource, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-text-primary dark:text-white">
                              {resource.name}
                            </h4>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                              {resource.country}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary dark:text-gray-400 mb-3">
                            {resource.description}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {resource.type === 'call' && resource.phone && (
                              <button
                                onClick={() => handleCall(resource.phone)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                              >
                                <Phone size={18} />
                                Call {resource.phone}
                              </button>
                            )}
                            {resource.type === 'text' && resource.phone && (
                              <button
                                onClick={() => handleText(resource.phone)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <MessageCircle size={18} />
                                Text {resource.phone}
                              </button>
                            )}
                            {resource.type === 'web' && resource.url && (
                              <button
                                onClick={() => handleWebsite(resource.url)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <ExternalLink size={18} />
                                Visit Website
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Resources */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-text-primary dark:text-white mb-2">
                    Other Ways to Get Help
                  </h4>
                  <ul className="space-y-2 text-sm text-text-secondary dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>Talk to a trusted friend, family member, or mental health professional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>Use the Space4U mood tracking and journaling tools to process your feelings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>Visit our Professional Support section to find therapists in your area</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>Join our supportive community circles for peer support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-text-tertiary dark:text-gray-500 text-center">
                  Remember: Your life matters. These feelings are temporary, and help is available.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
