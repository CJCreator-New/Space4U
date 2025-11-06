import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Bell, BellOff, Trash2, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SafeComponent from '../components/SafeComponent'
import LimitWarningBanner from '../components/common/LimitWarningBanner'
import { getPremiumStatus } from '../utils/premiumUtils'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import ReminderTest from '../components/common/ReminderTest'
import { disclaimers } from '../data/disclaimers'

function RemindersPage() {
  const { t } = useTranslation()
  
  const REMINDER_TYPES = [
    { value: 'mood_checkin', label: t('reminders.moodCheckIn'), icon: '' },
    { value: 'medication', label: t('reminders.medication'), icon: '' },
    { value: 'therapy', label: t('reminders.therapy'), icon: ' ' },
    { value: 'habit', label: t('reminders.habit'), icon: '' },
    { value: 'custom', label: t('reminders.custom'), icon: 'â°' }
  ]

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
    loadReminders()
  }, [])

  const loadReminders = async () => {
    const { getReminders } = await import('../utils/storageHelpers')
    const saved = await getReminders()
    setReminders(saved)
  }

  const handleAddClick = () => {
    if (!isPremium && reminders.length >= FREE_REMINDER_LIMIT) {
      navigate('/premium')
      return
    }
    setShowModal(true)
  }

  const addReminder = async () => {
    const { saveReminders } = await import('../utils/storageHelpers')
    const reminder = { ...newReminder, id: Date.now() }
    const updated = [...reminders, reminder]
    await saveReminders(updated)
    setReminders(updated)
    setShowModal(false)
    setNewReminder({ type: 'mood_checkin', title: '', time: '09:00', days: [1, 2, 3, 4, 5], enabled: true })
  }

  const toggleReminder = async (id) => {
    const { saveReminders } = await import('../utils/storageHelpers')
    const updated = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    await saveReminders(updated)
    setReminders(updated)
  }

  const deleteReminder = async (id) => {
    const { saveReminders } = await import('../utils/storageHelpers')
    const updated = reminders.filter(r => r.id !== id)
    await saveReminders(updated)
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{t('reminders.title')}</h1>
            {isPremium && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
                <Crown size={12} />
                {t('premium.title')}
              </div>
            )}
          </div>
          <p className="text-text-secondary">{t('reminders.subtitle')}</p>
        </div>
        <button onClick={handleAddClick} className="btn-primary">
          <Plus className="w-5 h-5" /> {t('reminders.addReminder')}
        </button>
      </div>

      <div className="mb-8">
        <DisclaimerBanner disclaimer={disclaimers.general} />
      </div>

      {!isPremium && reminders.length >= FREE_REMINDER_LIMIT && (
        <LimitWarningBanner limit={FREE_REMINDER_LIMIT} feature="reminders" current={reminders.length} />
      )}

      {reminders.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">{t('reminders.noReminders')}</h3>
          <p className="text-text-secondary mb-6">{t('reminders.createFirst')}</p>
          <button onClick={handleAddClick} className="btn-primary">
            <Plus className="w-5 h-5" /> {t('reminders.createFirstReminder')}
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
            <h2 className="text-2xl font-bold mb-4">{t('reminders.newReminder')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('reminders.type')}</label>
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
                <label className="block text-sm font-medium mb-2">{t('reminders.titleOptional')}</label>
                <input
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="input w-full"
                  placeholder={t('reminders.customReminderName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('reminders.time')}</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('reminders.repeatOn')}</label>
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
                    </button >
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={addReminder} disabled={newReminder.days.length === 0} className="btn-primary flex-1">{t('common.create')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test component for reminder toasts */}
      <ReminderTest />
    </div>
  
    </SafeComponent>
  )
}

export default RemindersPage

