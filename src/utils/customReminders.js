// Custom Reminders System

export const REMINDER_TYPES = {
  mood: { id: 'mood', label: 'Mood Check-in', icon: '😊' },
  gratitude: { id: 'gratitude', label: 'Gratitude Journal', icon: '🙏' },
  habit: { id: 'habit', label: 'Habit Tracker', icon: '✔' },
  breathing: { id: 'breathing', label: 'Breathing Exercise', icon: '🧘' },
  custom: { id: 'custom', label: 'Custom Reminder', icon: '⏰' }
}

export const createReminder = (type, time, message, days = [0,1,2,3,4,5,6]) => {
  const reminders = getReminders()
  
  const reminder = {
    id: Date.now(),
    type,
    time,
    message,
    days, // 0=Sunday, 1=Monday, etc.
    enabled: true,
    createdAt: new Date().toISOString()
  }
  
  reminders.push(reminder)
  saveReminders(reminders)
  return reminder
}

export const updateReminder = (id, updates) => {
  const reminders = getReminders()
  const index = reminders.findIndex(r => r.id === id)
  
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates }
    saveReminders(reminders)
    return reminders[index]
  }
  
  return null
}

export const deleteReminder = (id) => {
  const reminders = getReminders()
  const filtered = reminders.filter(r => r.id !== id)
  saveReminders(filtered)
}

export const toggleReminder = (id) => {
  const reminders = getReminders()
  const reminder = reminders.find(r => r.id === id)
  
  if (reminder) {
    reminder.enabled = !reminder.enabled
    saveReminders(reminders)
    return reminder.enabled
  }
  
  return false
}

export const getReminders = () => {
  return JSON.parse(localStorage.getItem('space4u_custom_reminders') || '[]')
}

export const saveReminders = (reminders) => {
  localStorage.setItem('space4u_custom_reminders', JSON.stringify(reminders))
}

export const shouldShowReminder = (reminder) => {
  if (!reminder.enabled) return false
  
  const now = new Date()
  const currentDay = now.getDay()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  return reminder.days.includes(currentDay) && reminder.time === currentTime
}

export const getActiveReminders = () => {
  const reminders = getReminders()
  return reminders.filter(shouldShowReminder)
}