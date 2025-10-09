import { useState, useEffect } from 'react'
import { Plus, Bell, BellOff, Trash2, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SafeComponent from '../components/SafeComponent'
import LimitWarningBanner from '../components/common/LimitWarningBanner'
import { getPremiumStatus } from '../utils/premiumUtils'

const REMINDER_TYPES = [
  { value: 'mood_checkin', label: 'Mood Check-in', icon: '😊' },
  { value: 'medication', label: 'Medication', icon: '💊' },
  { value: 'therapy', label: 'Therapy', icon: '🧠' },
  { value: 'habit', label: 'Habit', icon: '🎯' },
  { value: 'custom', label: 'Custom', icon: '⏰' }
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function RemindersPage() {
  const navigate = useNavigate()
  const [reminders, setReminders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newReminder, setNewReminder] = useState({
    type: 'mood_checkin',
    title: '',
    time: '09:00',
    days: [1, 2, 3, 4, 5],
    enabled: true
  })
  const { isPremium } = getPremiumStatus()
  const FREE_REMINDER_LIMIT = 5

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('safespace_reminders') || '[]')
    setReminders(saved)
  }, [])

  const handleAddClick = () => {
    if (!isPremium && reminders.length >= FREE_REMINDER_LIMIT) {
      navigate('/premium')
      return
    }
    setShowModal(true)
  }

  const addReminder = () => {
    const reminder = { ...newReminder, id: Date.now() }
    const updated = [...reminders, reminder]
    localStorage.setItem('safespace_reminders', JSON.stringify(updated))
    setReminders(updated)
    setShowModal(false)
    setNewReminder({ type: 'mood_checkin', title: '', time: '09:00', days: [1, 2, 3, 4, 5], enabled: true })
  }

  const toggleReminder = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    localStorage.setItem('safespace_reminders', JSON.stringify(updated))
    setReminders(updated)
  }

  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id)
    localStorage.setItem('safespace_reminders', JSON.stringify(updated))
    setReminders(updated)
  }

  const toggleDay = (day) => {
    const updated = newReminder.days.includes(day)
      ? newReminder.days.filter(d => d !== day)
      : [...newReminder.days, day]
    setNewReminder({ ...newReminder, days: updated })
  }

  return (
    <SafeComponent>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Smart Reminders</h1>
            {isPremium && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
                <Crown size={12} />
                Premium
              </div>
            )}
          </div>
          <p className="text-text-secondary">Stay on track with your wellness routine</p>
        </div>
        <button onClick={handleAddClick} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Reminder
        </button>
      </div>

      {!isPremium && reminders.length >= FREE_REMINDER_LIMIT && (
        <LimitWarningBanner limit={FREE_REMINDER_LIMIT} feature="reminders" current={reminders.length} />
      )}

      {reminders.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Reminders Yet</h3>
          <p className="text-text-secondary mb-6">Create reminders to stay consistent</p>
          <button onClick={handleAddClick} className="btn-primary">
            <Plus className="w-5 h-5" /> Create First Reminder
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map(reminder => {
            const type = REMINDER_TYPES.find(t => t.value === reminder.type)
            return (
              <div key={reminder.id} className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{type?.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{reminder.title || type?.label}</h3>
                      <p className="text-text-secondary text-sm">
                        {reminder.time} • {reminder.days.map(d => DAYS[d]).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className="p-2 hover:bg-hover rounded-lg"
                    >
                      {reminder.enabled ? (
                        <Bell className="w-5 h-5 text-primary" />
                      ) : (
                        <BellOff className="w-5 h-5 text-text-secondary" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 hover:bg-hover rounded-lg text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">New Reminder</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                  className="input w-full"
                >
                  {REMINDER_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <input
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="input w-full"
                  placeholder="Custom reminder name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Repeat On</label>
                <div className="flex gap-2">
                  {DAYS.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => toggleDay(i)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                        newReminder.days.includes(i) ? 'bg-primary text-white' : 'bg-hover'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={addReminder} disabled={newReminder.days.length === 0} className="btn-primary flex-1">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  
    </SafeComponent>
  )
}

export default RemindersPage
