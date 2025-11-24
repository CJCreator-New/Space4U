import { Controller } from 'react-hook-form'
import TagSelector from './mood/TagSelector'
import { motion } from 'framer-motion'
import { useMoodEntry } from '../hooks/useMoodEntry'

function MoodTracker({ onMoodLogged }) {
  const {
    moodState,
    form: { control, handleSubmit, watch },
    handleMoodSelect,
    handleLogMood,
    handleUpdate,
    MOODS
  } = useMoodEntry(onMoodLogged)

  const watchedMood = watch('mood')
  const watchedNote = watch('note')

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (moodState.showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="p-6 mb-6 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md"
      >
        <div className="text-4xl mb-4">🎉</div>
        <div className="text-xl font-semibold mb-2">Mood logged!</div>
        {moodState.streak > 1 && (
          <div className="text-gray-600 dark:text-gray-400">
            {moodState.streak} day streak! Keep it up 🔥
          </div>
        )}
      </motion.div>
    )
  }

  if (moodState.isLogged && moodState.todaysMood) {
    return (
      <div className="p-6 mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="text-3xl">{moodState.todaysMood.emoji}</div>
            <div>
              <div className="font-semibold">
                Today's mood: {moodState.todaysMood.label}
              </div>
              {moodState.todaysMood.note && (
                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 max-w-xs">
                  {moodState.todaysMood.note}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleUpdate}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Update
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogMood)}
      className="p-6 mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md"
    >
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{dateString}</div>
          <div className="text-xl font-semibold">{greeting}!</div>
          <div className="mt-2">How are you feeling right now?</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select your mood</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <div className="pt-6 pb-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={field.value}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    field.onChange(val)
                    handleMoodSelect(MOODS.find(m => m.value === val))
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="flex justify-between mt-2">
                  {MOODS.map((mood) => (
                    <div
                      key={mood.value}
                      className={`flex flex-col items-center transition-colors ${watchedMood === mood.value ? 'text-blue-500 scale-110' : 'text-gray-400'
                        }`}
                    >
                      <span className="text-xl mb-1">{mood.emoji}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
          {moodState.selectedMood && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
              {moodState.selectedMood.label}
            </div>
          )}
        </div>

        {moodState.showNote && (
          <div className="space-y-4 animate-fadeIn">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagSelector
                  selectedTags={field.value}
                  onChange={field.onChange}
                  maxTags={5}
                />
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Add a note (optional)
              </label>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="How are you feeling?"
                    rows={3}
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 resize-none"
                  />
                )}
              />
              <div className="text-xs text-gray-500 text-right">
                {watchedNote?.length || 0}/200
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Log Mood
            </button>
          </div>
        )}
      </div>
    </form>
  )
}

export default MoodTracker