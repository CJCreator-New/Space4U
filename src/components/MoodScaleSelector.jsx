import { useState } from 'react'
import { Check } from 'lucide-react'
import { MOOD_SCALES, getUserMoodScale, setUserMoodScale } from '../utils/moodScales'

function MoodScaleSelector({ onSelect }) {
  const [selectedScale, setSelectedScale] = useState(getUserMoodScale())

  const handleSelect = (scaleId) => {
    setSelectedScale(scaleId)
    setUserMoodScale(scaleId)
    onSelect?.(scaleId)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
          Mood Tracking Scale
        </h3>
        <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
          Choose how you want to track your mood
        </p>
      </div>

      <div className="space-y-3">
        {Object.values(MOOD_SCALES).map((scale) => (
          <button
            key={scale.id}
            onClick={() => handleSelect(scale.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              selectedScale === scale.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-text-primary dark:text-white">
                  {scale.name}
                </h4>
                <p className="text-sm text-text-secondary dark:text-gray-400">
                  {scale.description}
                </p>
              </div>
              {selectedScale === scale.id && (
                <Check className="text-primary flex-shrink-0" size={20} />
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {scale.points.map((point) => (
                <div
                  key={point.value}
                  className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <span className="text-2xl">{point.emoji}</span>
                  <span className="text-xs text-text-secondary dark:text-gray-400">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MoodScaleSelector
