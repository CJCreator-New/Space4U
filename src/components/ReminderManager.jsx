import { useState, useEffect } from 'react'
import { Plus, Trash2, Bell, BellOff } from '../config/icons'
import { REMINDER_TYPES, getReminders, createReminder, deleteReminder, toggleReminder } from '../utils/customReminders'

function ReminderManager() {
  const [reminders, setReminders] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newReminder, setNewReminder] = useState({
    type: 'mood',
    time: '09:00',
    message: '',
    days: [1,2,3,4,5] // Weekdays
  })

  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = () => {
    setReminders(getReminders())
  }

  const handleAdd = () => {
    const message = newReminder.message || REMINDER_TYPES[newReminder.type].label
    createReminder(newReminder.type, newReminder.time, message, newReminder.days)
    loadReminders()
    setShowAdd(false)
    setNewReminder({ type: 'mood', time: '09:00', message: '', days: [1,2,3,4,5] })
  }

  const handleDelete = (id) => {
    deleteReminder(id)
    loadReminders()
  }

  const handleToggle = (id) => {
    toggleReminder(id)
    loadReminders()
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white">
            Custom Reminders
          </h3>
          <p className="text-sm text-text-secondary dark:text-gray-400">
            {reminders.length} {reminders.length === 1 ? 'reminder' : 'reminders'} set
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Reminder
        </button>
      </div>

      {showAdd && (
        <div className="card p-4 border-2 border-primary">
          <h4 className="font-semibold text-text-primary dark:text-white mb-3">New Reminder</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                Type
              </label>
              <select
                value={newReminder.type}
                onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                className="w-full p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-text-primary dark:text-white"
              >
                {Object.values(REMINDER_TYPES).map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                Time
              </label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="w-full p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-text-primary dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
                Days
              </label>
              <div className="flex gap-2">
                {dayNames.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const days = newReminder.days.includes(idx)
                        ? newReminder.days.filter(d => d !== idx)
                        : [...newReminder.days, idx]
                      setNewReminder({ ...newReminder, days })
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      newReminder.days.includes(idx)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {reminders.map(reminder => (
          <div
            key={reminder.id}
            className="card p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">{REMINDER_TYPES[reminder.type]?.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-text-primary dark:text-white">
                  {reminder.message}
                </p>
                <p className="text-sm text-text-secondary dark:text-gray-400">
                  {reminder.time} • {reminder.days.map(d => dayNames[d]).join(', ')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(reminder.id)}
                className={`p-2 rounded-lg transition-colors ${
                  reminder.enabled
                    ? 'text-primary hover:bg-primary/10'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {reminder.enabled ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
              <button
                onClick={() => handleDelete(reminder.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {reminders.length === 0 && !showAdd && (
          <div className="text-center py-8 text-text-secondary dark:text-gray-400">
            <Bell className="mx-auto mb-2 opacity-50" size={48} />
            <p>No custom reminders yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReminderManager
