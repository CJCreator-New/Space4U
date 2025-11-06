import { useEffect, useRef } from 'react'
import { useReminders } from '../../contexts/ReminderContext'
import { getActiveReminders } from '../../utils/customReminders'

function ReminderScheduler() {
  const { showReminder } = useReminders()
  const lastCheckRef = useRef(null)
  const shownRemindersRef = useRef(new Set())

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

      // Only check once per minute to avoid spam
      if (lastCheckRef.current === currentTime) return
      lastCheckRef.current = currentTime

      const activeReminders = getActiveReminders()

      activeReminders.forEach(reminder => {
        // Create a unique key for this reminder at this time
        const reminderKey = `${reminder.id}-${currentTime}`

        if (!shownRemindersRef.current.has(reminderKey)) {
          showReminder(reminder.message, {
            type: reminder.type,
            duration: 8000, // 8 seconds for reminders
            action: {
              label: 'Open',
              onClick: () => {
                // Navigate to the appropriate page based on reminder type
                const routes = {
                  mood: '/mood-tracker',
                  gratitude: '/gratitude-journal',
                  habit: '/habit-tracker',
                  breathing: '/breathing-exercises',
                  custom: '/reminders'
                }
                window.location.href = routes[reminder.type] || '/dashboard'
              }
            }
          })

          shownRemindersRef.current.add(reminderKey)

          // Clean up old reminder keys after some time
          setTimeout(() => {
            shownRemindersRef.current.delete(reminderKey)
          }, 60000) // Remove after 1 minute
        }
      })
    }

    // Check immediately
    checkReminders()

    // Check every 30 seconds
    const interval = setInterval(checkReminders, 30000)

    return () => clearInterval(interval)
  }, [showReminder])

  return null // This component doesn't render anything
}

export default ReminderScheduler