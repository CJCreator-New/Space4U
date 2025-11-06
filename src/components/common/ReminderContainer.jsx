import { useReminders } from '../../contexts/ReminderContext'
import ReminderToast from './ReminderToast'

const ReminderContainer = () => {
  const { activeToasts, dismissReminder } = useReminders()

  return (
    <>
      {activeToasts.map((toast) => (
        <ReminderToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          action={toast.action}
          actionLabel={toast.actionLabel}
          onDismiss={() => dismissReminder(toast.id)}
        />
      ))}
    </>
  )
}

export default ReminderContainer