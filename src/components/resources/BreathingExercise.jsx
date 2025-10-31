import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const EXERCISES = {
  box: {
    name: 'Box Breathing',
    description: 'Equal breathing for calm and focus',
    phases: [
      { name: 'Breathe In', duration: 4, instruction: 'Inhale slowly through your nose' },
      { name: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
      { name: 'Breathe Out', duration: 4, instruction: 'Exhale slowly through your mouth' },
      { name: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
    ],
    color: 'from-blue-400 to-cyan-500'
  },
  calm: {
    name: '4-7-8 Breathing',
    description: 'Deep relaxation technique',
    phases: [
      { name: 'Breathe In', duration: 4, instruction: 'Inhale through your nose' },
      { name: 'Hold', duration: 7, instruction: 'Hold your breath' },
      { name: 'Breathe Out', duration: 8, instruction: 'Exhale completely through your mouth' },
    ],
    color: 'from-purple-400 to-pink-500'
  },
  energize: {
    name: 'Energizing Breath',
    description: 'Quick breathing for energy',
    phases: [
      { name: 'Breathe In', duration: 2, instruction: 'Quick inhale through nose' },
      { name: 'Breathe Out', duration: 2, instruction: 'Quick exhale through mouth' },
    ],
    color: 'from-orange-400 to-red-500'
  }
}

function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState('box')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [completedCycles, setCompletedCycles] = useState(0)
  const intervalRef = useRef(null)

  const exercise = EXERCISES[selectedExercise]
  const phase = exercise.phases[currentPhase]

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isPlaying) {
      nextPhase()
    }

    return () => clearInterval(intervalRef.current)
  }, [isPlaying, timeLeft])

  const nextPhase = () => {
    const nextPhaseIndex = (currentPhase + 1) % exercise.phases.length
    if (nextPhaseIndex === 0) {
      setCompletedCycles(prev => prev + 1)
    }
    setCurrentPhase(nextPhaseIndex)
    setTimeLeft(exercise.phases[nextPhaseIndex].duration)
  }

  const startExercise = () => {
    if (!isPlaying) {
      setTimeLeft(phase.duration)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const resetExercise = () => {
    setIsPlaying(false)
    setCurrentPhase(0)
    setTimeLeft(exercise.phases[0].duration)
    setCompletedCycles(0)
    clearInterval(intervalRef.current)
  }

  const changeExercise = (key) => {
    resetExercise()
    setSelectedExercise(key)
  }

  useEffect(() => {
    const saved = localStorage.getItem('space4u_breathing_sessions')
    if (saved) setTotalSessions(parseInt(saved))
  }, [])

  useEffect(() => {
    if (completedCycles > 0) {
      const newTotal = totalSessions + 1
      setTotalSessions(newTotal)
      localStorage.setItem('space4u_breathing_sessions', newTotal.toString())
    }
  }, [completedCycles])

  const circleScale = isPlaying ? (phase.name.includes('In') ? 1.5 : 0.8) : 1

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">Breathing Exercises</h2>
        <p className="text-text-secondary mb-4">
          Guided breathing to reduce stress and improve focus
        </p>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.entries(EXERCISES).map(([key, ex]) => (
            <button
              key={key}
              onClick={() => changeExercise(key)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedExercise === key
                  ? 'bg-gradient-to-r ' + ex.color + ' text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-1">{exercise.name}</h3>
          <p className="text-text-secondary text-sm">{exercise.description}</p>
        </div>

        <div className="relative flex items-center justify-center mb-8" style={{ height: '300px' }}>
          <div
            className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${exercise.color} opacity-20 transition-transform duration-${phase?.duration || 4}000 ease-in-out`}
            style={{
              transform: `scale(${circleScale})`,
              transition: isPlaying ? `transform ${phase.duration}s ease-in-out` : 'transform 0.3s ease'
            }}
          />
          
          <div className="relative z-10 text-center">
            <div className="text-6xl font-bold mb-2">{timeLeft || phase.duration}</div>
            <div className="text-xl font-semibold mb-1">{phase.name}</div>
            <div className="text-sm text-text-secondary max-w-xs">{phase.instruction}</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mb-6">
          <button
            onClick={startExercise}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={resetExercise}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{completedCycles}</div>
            <div className="text-sm text-text-secondary">Cycles Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalSessions}</div>
            <div className="text-sm text-text-secondary">Total Sessions</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Benefits of Breathing Exercises</h3>
        <ul className="space-y-2 text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">âœ“</span>
            <span>Reduces stress and anxiety</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">âœ“</span>
            <span>Improves focus and concentration</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">âœ“</span>
            <span>Lowers blood pressure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">âœ“</span>
            <span>Promotes better sleep</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">âœ“</span>
            <span>Increases emotional regulation</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BreathingExercise

