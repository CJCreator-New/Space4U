import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const FACTORS = ['Caffeine', 'Exercise', 'Stress', 'Screen Time', 'Alcohol', 'Late Meal', 'Nap']

function SleepHygieneTracker({ onClose }) {
  const { user } = useAuth()
  const [log, setLog] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '22:00',
    wake_time: '06:00',
    sleep_quality: 3,
    factors: [],
    notes: ''
  })

  const calculateDuration = () => {
    const [bedHour, bedMin] = log.bedtime.split(':').map(Number)
    const [wakeHour, wakeMin] = log.wake_time.split(':').map(Number)
    let hours = wakeHour - bedHour
    let mins = wakeMin - bedMin
    if (hours < 0) hours += 24
    if (mins < 0) { hours--; mins += 60 }
    return (hours + mins / 60).toFixed(1)
  }

  const toggleFactor = (factor) => {
    setLog(prev => ({
      ...prev,
      factors: prev.factors.includes(factor)
        ? prev.factors.filter(f => f !== factor)
        : [...prev.factors, factor]
    }))
  }

  const handleSave = async () => {
    const data = { ...log, sleep_duration: parseFloat(calculateDuration()) }
    
    if (user) {
      console.log('Saving to database:', data)
    } else {
      const saved = JSON.parse(localStorage.getItem('safespace_sleep_logs') || '[]')
      const existing = saved.findIndex(s => s.date === log.date)
      if (existing >= 0) saved[existing] = { ...data, id: saved[existing].id }
      else saved.push({ ...data, id: Date.now() })
      localStorage.setItem('safespace_sleep_logs', JSON.stringify(saved))
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sleep Hygiene Tracker</h2>
          <button onClick={onClose} className="p-2 hover:bg-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={log.date}
              onChange={(e) => setLog({ ...log, date: e.target.value })}
              className="input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedtime</label>
              <input
                type="time"
                value={log.bedtime}
                onChange={(e) => setLog({ ...log, bedtime: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Wake Time</label>
              <input
                type="time"
                value={log.wake_time}
                onChange={(e) => setLog({ ...log, wake_time: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>

          <div className="card p-4 bg-primary/10">
            <p className="text-sm text-text-secondary">Total Sleep Duration</p>
            <p className="text-3xl font-bold text-primary">{calculateDuration()} hours</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sleep Quality (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setLog({ ...log, sleep_quality: rating })}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    log.sleep_quality === rating
                      ? 'bg-primary text-white'
                      : 'bg-hover text-text-secondary hover:bg-hover/80'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Factors Affecting Sleep</label>
            <div className="flex flex-wrap gap-2">
              {FACTORS.map(factor => (
                <button
                  key={factor}
                  onClick={() => toggleFactor(factor)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    log.factors.includes(factor)
                      ? 'bg-primary text-white'
                      : 'bg-hover text-text-secondary hover:bg-hover/80'
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={log.notes}
              onChange={(e) => setLog({ ...log, notes: e.target.value })}
              className="input w-full h-24"
              placeholder="Any observations about your sleep..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-border p-6">
          <button onClick={handleSave} className="btn-primary w-full">
            Save Sleep Log
          </button>
        </div>
      </div>
    </div>
  )
}

export default SleepHygieneTracker
