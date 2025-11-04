// Notification & Reminder System

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return { granted: false, reason: 'not_supported' }
  }
  
  if (Notification.permission === 'granted') {
    return { granted: true }
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return { granted: permission === 'granted' }
  }
  
  return { granted: false, reason: 'denied' }
}

export const scheduleReminder = (time, message) => {
  const settings = JSON.parse(localStorage.getItem('space4u_settings') || '{}')
  const reminders = JSON.parse(localStorage.getItem('space4u_reminders') || '[]')
  
  const reminder = {
    id: Date.now(),
    time,
    message,
    enabled: true,
    createdAt: new Date().toISOString()
  }
  
  reminders.push(reminder)
  localStorage.setItem('space4u_reminders', JSON.stringify(reminders))
  
  return reminder
}

export const checkReminders = () => {
  const reminders = JSON.parse(localStorage.getItem('space4u_reminders') || '[]')
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  reminders.forEach(reminder => {
    if (reminder.enabled && reminder.time === currentTime) {
      showNotification(reminder.message)
    }
  })
}

export const showNotification = (message, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification('Space4U', {
      body: message,
      icon: '/icon.png',
      badge: '/badge.png',
      ...options
    })
  }
}

export const checkDailyMoodReminder = () => {
  const settings = JSON.parse(localStorage.getItem('space4u_settings') || '{}')
  if (!settings.notifications?.dailyReminder) return
  
  const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
  const today = new Date().toISOString().split('T')[0]
  
  if (!moods[today]) {
    const now = new Date()
    const reminderTime = settings.notifications.reminderTime || '09:00'
    const [hour, minute] = reminderTime.split(':')
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    if (currentTime === reminderTime) {
      showNotification('Time to check in! How are you feeling today?', {
        tag: 'daily-mood',
        requireInteraction: true
      })
    }
  }
}

export const checkStreakReminder = () => {
  const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
  const dates = Object.keys(moods).sort()
  
  if (dates.length === 0) return
  
  const lastDate = dates[dates.length - 1]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  if (lastDate === yesterdayStr) {
    const today = new Date().toISOString().split('T')[0]
    if (!moods[today]) {
      showNotification('Don\'t break your streak! Log your mood today 🔥', {
        tag: 'streak-reminder'
      })
    }
  }
}

export const initNotifications = () => {
  // Check reminders every minute
  setInterval(() => {
    checkDailyMoodReminder()
  }, 60000)
  
  // Check streak reminder once per day at 8 PM
  const checkStreak = () => {
    const now = new Date()
    if (now.getHours() === 20 && now.getMinutes() === 0) {
      checkStreakReminder()
    }
  }
  setInterval(checkStreak, 60000)
}