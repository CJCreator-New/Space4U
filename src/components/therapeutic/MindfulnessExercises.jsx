import { useState } from 'react'
import { X, Play, Pause, RotateCcw } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const EXERCISES = [
  { id: 'meditation', name: 'Guided Meditation', duration: 10, description: 'Focus on breath and body awareness' },
  { id: 'body_scan', name: 'Body Scan', duration: 15, description: 'Progressive relaxation through body' },
  { id: 'mindful_breathing', name: 'Mindful Breathing', duration: 5, description: 'Simple breath awareness' },
  { id: 'loving_kindness', name: 'Loving Kindness', duration: 12, description: 'Cultivate compassion and kindness' }
]

function MindfulnessExercises({ onClose }) {
  const { user } = useAuth()
  const [selected, setSelected] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [session, setSession] = useState({
    mood_before: 3,
    mood_after: 3,
    notes: ''
  })

  const startExercise = (exercise) => {
    setSelected(exercise)
    setTimeLeft(exercise.duration * 60)
  }

  const handleComplete = async () => {
    const data = {
      exercise_type: selected.id,
      duration: selected.duration,
      mood_before: session.mood_before,
      mood_after: session.mood_after,
      notes: session.notes
    }

    if (user) {
      // TODO: Implement database save for authenticated users
    } else {
      const saved = JSON.parse(localStorage.getItem('space4u_mindfulness_sessions') || '[]')
      saved.push({ ...data, id: Date.now(), created_at: new Date().toISOString() })
      localStorage.setItem('space4u_mindfulness_sessions', JSON.stringify(saved))
    }
    onClose()
  }

  if (selected) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-2xl max-w-lg w-full p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{selected.name}</h3>
            <p className="text-text-secondary">{selected.description}</p>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className="btn-primary">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={() => setTimeLeft(selected.duration * 60)} className="btn-secondary">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mood Before (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={session.mood_before}
                onChange={(e) => setSession({ ...session, mood_before: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mood After (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={session.mood_after}
                onChange={(e) => setSession({ ...session, mood_after: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={session.notes}
                onChange={(e) => setSession({ ...session, notes: e.target.value })}
                className="input w-full h-24"
                placeholder="How was your experience?"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Back</button>
            <button onClick={handleComplete} className="btn-primary flex-1">Complete</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Mindfulness Exercises</h2>
          <button onClick={onClose} className="p-2 hover:bg-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXERCISES.map(exercise => (
            <button
              key={exercise.id}
              onClick={() => startExercise(exercise)}
              className="card p-6 text-left hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
              <p className="text-text-secondary text-sm mb-3">{exercise.description}</p>
              <span className="text-primary font-medium">{exercise.duration} minutes</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MindfulnessExercises

