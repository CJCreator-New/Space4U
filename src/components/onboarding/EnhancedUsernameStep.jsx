import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react'
import * as Label from '@radix-ui/react-label'
import ProgressIndicator from './ProgressIndicator'

const anonymousNames = [
  'MindfulWanderer', 'QuietStrength', 'BraveHeart', 'CalmSoul', 'HopefulJourney',
  'PeacefulMind', 'GentleSpirit', 'ResilientOne', 'SereneVibes', 'KindnessMatters',
  'InnerPeace', 'CourageousPath', 'TranquilMind', 'WarmHeart', 'BrightHorizon'
]

function EnhancedUsernameStep({ data, onNext, onBack, onSkip }) {
  const [username, setUsername] = useState(data.username || '')
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState(
    anonymousNames.sort(() => Math.random() - 0.5).slice(0, 3)
  )

  const validateUsername = (value) => {
    if (value.length < 3) return 'Username must be at least 3 characters'
    if (value.length > 20) return 'Username must be 20 characters or less'
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed'
    return ''
  }

  const handleChange = (e) => {
    const value = e.target.value
    setUsername(value)
    setError(validateUsername(value))
  }

  const handleSubmit = () => {
    const validationError = validateUsername(username)
    if (!validationError) {
      onNext({ username })
    } else {
      setError(validationError)
    }
  }

  const refreshSuggestions = () => {
    setSuggestions(anonymousNames.sort(() => Math.random() - 0.5).slice(0, 3))
  }

  const isValid = username && !error

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

      <ProgressIndicator current={1} total={4} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose your anonymous identity</h2>
        <p className="text-gray-600 text-sm">This is how you'll appear in communities - no real name needed</p>
      </motion.div>

      <div className="mb-4">
        <Label.Root htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </Label.Root>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Enter username"
          className={`w-full p-4 border-2 rounded-xl text-lg outline-none transition-all ${
            error ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }`}
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'username-error' : 'username-help'}
        />
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id="username-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-600 text-sm mt-2"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <p id="username-help" className="text-xs text-gray-500 mt-2">
          3-20 characters, letters, numbers, and underscores only
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Label.Root className="text-sm font-medium text-gray-700">
            Suggestions
          </Label.Root>
          <button
            onClick={refreshSuggestions}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="Refresh username suggestions"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((name) => (
            <motion.button
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setUsername(name)
                setError('')
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {name}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: isValid ? 1.02 : 1 }}
        whileTap={{ scale: isValid ? 0.98 : 1 }}
        onClick={handleSubmit}
        disabled={!isValid}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          isValid
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-disabled={!isValid}
      >
        Continue
      </motion.button>
    </div>
  )
}

export default EnhancedUsernameStep
