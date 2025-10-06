import { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Circle, TrendingUp } from 'lucide-react'

function HabitTrackerPage() {
  const [habits, setHabits] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', icon: '🎯', color: 'blue', frequency: 'daily' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('safespace_habits') || '[]')
    setHabits(saved)
  }, [])

  const addHabit = () => {
    const habit = { ...newHabit, id: Date.now(), completions: {} }
    const updated = [...habits, habit]
    localStorage.setItem('safespace_habits', JSON.stringify(updated))
    setHabits(updated)
    setShowModal(false)
    setNewHabit({ name: '', icon: '🎯', color: 'blue', frequency: 'daily' })
  }

  const toggleCompletion = (habitId) => {
    const today = new Date().toISOString().split('T')[0]
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const completions = { ...h.completions }
        completions[today] = !completions[today]
        return { ...h, completions }
      }
      return h
    })
    localStorage.setItem('safespace_habits', JSON.stringify(updated))
    setHabits(updated)
  }

  const getStreak = (habit) => {
    let streak = 0
    let date = new Date()
    while (habit.completions[date.toISOString().split('T')[0]]) {
      streak++
      date.setDate(date.getDate() - 1)
    }
    return streak
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Habit Tracker</h1>
          <p className="text-text-secondary">Build better habits, one day at a time</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="card p-12 text-center">
          <TrendingUp className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Start Building Habits</h3>
          <p className="text-text-secondary mb-6">Track daily habits and build consistency</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" /> Create First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleCompletion(habit.id)}
                    className="text-4xl hover:scale-110 transition-transform"
                  >
                    {habit.completions[today] ? (
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    ) : (
                      <Circle className="w-10 h-10 text-text-secondary" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{habit.icon}</span>
                      <h3 className="text-xl font-semibold">{habit.name}</h3>
                    </div>
                    <p className="text-text-secondary text-sm">
                      {getStreak(habit)} day streak • {Object.values(habit.completions).filter(Boolean).length} total
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">New Habit</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Habit Name</label>
                <input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="input w-full"
                  placeholder="Exercise, Meditate, Read..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {['🎯', '💪', '🧘', '📚', '💧', '🏃', '🎨', '🎵'].map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewHabit({ ...newHabit, icon })}
                      className={`text-3xl p-2 rounded-lg ${newHabit.icon === icon ? 'bg-primary/20' : 'hover:bg-hover'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={addHabit} disabled={!newHabit.name} className="btn-primary flex-1">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HabitTrackerPage
