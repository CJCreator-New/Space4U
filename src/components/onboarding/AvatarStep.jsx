import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator'

const avatars = ['🐻', '🦊', '🐰', '🦉', '🐱', '🐶', '🦋', '🌸', '🌙', '⭐', '🌈', '🌊']

function AvatarStep({ data, onNext, onBack, onSkip }) {
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar || '')

  const handleSubmit = () => {
    if (selectedAvatar) {
      onNext({ avatar: selectedAvatar })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <button onClick={onSkip} className="text-text-secondary text-sm">Skip</button>
      </div>

      <ProgressIndicator current={2} total={4} />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Pick your avatar</h2>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {avatars.map((avatar) => (
          <button
            key={avatar}
            onClick={() => setSelectedAvatar(avatar)}
            className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all ${
              selectedAvatar === avatar
                ? 'bg-primary/10 border-2 border-primary scale-105'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            {avatar}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedAvatar}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
          selectedAvatar
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  )
}

export default AvatarStep