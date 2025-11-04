import { useReminders } from '../../contexts/ReminderContext'

function ReminderTest() {
  const { showReminder } = useReminders()

  const testReminder = () => {
    showReminder('Test reminder: Time for a mood check-in! 😊', {
      type: 'mood',
      duration: 5000,
      action: {
        label: 'Check Mood',
        onClick: () => alert('Mood tracker would open here!')
      }
    })
  }

  const testGratitudeReminder = () => {
    showReminder('What are you grateful for today? 🙏', {
      type: 'gratitude',
      duration: 6000,
      action: {
        label: 'Journal',
        onClick: () => alert('Gratitude journal would open here!')
      }
    })
  }

  const testHabitReminder = () => {
    showReminder('Don\'t forget your daily habit! 💪', {
      type: 'habit',
      duration: 4000,
      action: {
        label: 'Track',
        onClick: () => alert('Habit tracker would open here!')
      }
    })
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary dark:text-white">
        Reminder Toast Test
      </h3>
      <p className="text-sm text-text-secondary dark:text-gray-400">
        Click the buttons below to test different reminder toast types with therapeutic animations.
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={testReminder}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Test Mood Reminder
        </button>
        <button
          onClick={testGratitudeReminder}
          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
        >
          Test Gratitude Reminder
        </button>
        <button
          onClick={testHabitReminder}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
        >
          Test Habit Reminder
        </button>
      </div>
    </div>
  )
}

export default ReminderTest