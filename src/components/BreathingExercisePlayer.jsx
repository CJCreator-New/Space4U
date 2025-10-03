import { useState, useEffect, useRef } from 'react'
import { Play, Pause, X } from 'lucide-react'
import { addPoints, POINT_VALUES } from '../utils/badgeSystem'

function BreathingExercisePlayer({ exercise, isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhase, setCurrentPhase] = useState('inhale')
  const [phaseTime, setPhaseTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [instruction, setInstruction] = useState('Breathe In')
  const intervalRef = useRef(null)

  const phases = ['inhale', 'hold1', 'exhale', 'hold2'].filter(phase => exercise?.pattern[phase] > 0)
  const totalDuration = exercise?.duration * 60 || 240 // seconds

  useEffect(() => {
    if (isPlaying && isOpen) {
      intervalRef.current = setInterval(() => {
        setPhaseTime(prev => {
          const currentPhaseDuration = exercise.pattern[currentPhase]
          if (prev >= currentPhaseDuration - 1) {
            // Move to next phase
            const currentIndex = phases.indexOf(currentPhase)
            const nextPhase = phases[(currentIndex + 1) % phases.length]
            setCurrentPhase(nextPhase)
            updateInstruction(nextPhase)
            return 0
          }
          return prev + 1
        })

        setTotalTime(prev => {
          if (prev >= totalDuration - 1) {
            handleComplete()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isPlaying, currentPhase, isOpen])

  const updateInstruction = (phase) => {
    const instructions = {
      inhale: 'Breathe In',
      hold1: 'Hold',
      exhale: 'Breathe Out',
      hold2: 'Hold'
    }
    setInstruction(instructions[phase])
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleComplete = () => {
    setIsPlaying(false)
    addPoints(POINT_VALUES.exercise, 'Breathing exercise completed')
    // Show completion message
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const handleClose = () => {
    if (isPlaying && totalTime > 30) {
      if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
        setIsPlaying(false)
        onClose()
      }
    } else {
      onClose()
    }
  }

  const getVisualizationStyle = () => {
    const progress = phaseTime / exercise.pattern[currentPhase]
    const scale = currentPhase === 'inhale' ? 1 + (progress * 0.5) : 
                  currentPhase === 'exhale' ? 1.5 - (progress * 0.5) : 1.25

    return {
      transform: `scale(${scale})`,
      transition: 'transform 1s ease-in-out'
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen || !exercise) return null

  const progressPercent = (totalTime / totalDuration) * 100
  const phaseProgress = (phaseTime / exercise.pattern[currentPhase]) * 100

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center text-white max-w-md mx-auto p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Exercise Title */}
        <h2 className="text-2xl font-bold mb-8">{exercise.title}</h2>

        {/* Visualization */}
        <div className="mb-8 flex items-center justify-center h-64">
          {exercise.visualization === 'circle' && (
            <div
              className="w-32 h-32 rounded-full border-4 border-white/50 bg-white/10"
              style={getVisualizationStyle()}
            />
          )}
          {exercise.visualization === 'box' && (
            <div
              className="w-32 h-32 border-4 border-white/50 bg-white/10"
              style={getVisualizationStyle()}
            />
          )}
          {exercise.visualization === 'wave' && (
            <div className="relative w-48 h-32">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                style={{
                  ...getVisualizationStyle(),
                  borderRadius: '50%'
                }}
              />
            </div>
          )}
        </div>

        {/* Current Instruction */}
        <div className="mb-8">
          <h3 className="text-4xl font-light mb-4">{instruction}</h3>
          <div className="text-6xl font-bold">
            {exercise.pattern[currentPhase] - phaseTime}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="bg-white/20 rounded-full h-2 mb-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm opacity-75">
            {formatTime(totalTime)} / {formatTime(totalDuration)}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePlay}
            className="flex items-center justify-center w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>

        {/* Completion Message */}
        {totalTime >= totalDuration && (
          <div className="mt-8 p-4 bg-success/20 rounded-xl">
            <p className="text-lg font-semibold">Exercise Complete! 🎉</p>
            <p className="text-sm opacity-75">+{POINT_VALUES.exercise} points earned</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BreathingExercisePlayer