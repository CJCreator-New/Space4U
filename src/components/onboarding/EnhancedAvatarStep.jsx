import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator'

const avatars = ['🐻', '🦊', '🐰', '🦉', '🐱', '🐶', '🦋', '🌸', '🌙', '⭐', '🌈', '🌊', '🌺', '🦄', '🐼', '🦁']

function EnhancedAvatarStep({ data, onNext, onBack, onSkip }) {
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar || '')

  const handleSubmit = () => {
    if (selectedAvatar) {
      onNext({ avatar: selectedAvatar })
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

      <ProgressIndicator current={2} total={4} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pick your avatar</h2>
        <p className="text-gray-600 text-sm">Choose an emoji that represents you</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-3 mb-8" role="radiogroup" aria-label="Avatar selection">
        {avatars.map((avatar, index) => (
          <motion.button
            key={avatar}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAvatar(avatar)}
            className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all ${
              selectedAvatar === avatar
                ? 'bg-blue-100 border-2 border-blue-500 shadow-lg'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
            role="radio"
            aria-checked={selectedAvatar === avatar}
            aria-label={`Avatar ${avatar}`}
          >
            <motion.span
              animate={selectedAvatar === avatar ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {avatar}
            </motion.span>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: selectedAvatar ? 1.02 : 1 }}
        whileTap={{ scale: selectedAvatar ? 0.98 : 1 }}
        onClick={handleSubmit}
        disabled={!selectedAvatar}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          selectedAvatar
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-disabled={!selectedAvatar}
      >
        Continue
      </motion.button>
    </div>
  )
}

export default EnhancedAvatarStep
