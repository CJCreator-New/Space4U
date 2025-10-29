import { useState } from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { Bell, Check, AlertCircle, Info, AlertTriangle, MessageCircle, Trophy } from 'lucide-react'

/**
 * NotificationTestPanel - A development component to test the notification system
 * 
 * Usage: Add this to any page (like HomePage or SettingsPage) temporarily
 * <NotificationTestPanel />
 * 
 * Remove or comment out after testing is complete
 */
export default function NotificationTestPanel() {
  const { createNotification, notifications, unreadCount } = useNotifications()
  const [isExpanded, setIsExpanded] = useState(true)

  const testNotifications = [
    {
      title: 'Success Test ✅',
      message: 'This is a success notification',
      type: 'success',
      actionUrl: '/'
    },
    {
      title: 'Info Test ℹ️',
      message: 'This is an informational notification',
      type: 'info',
      actionUrl: '/profile'
    },
    {
      title: 'Warning Test ⚠️',
      message: 'This is a warning notification',
      type: 'warning',
      actionUrl: '/settings'
    },
    {
      title: 'Error Test ❌',
      message: 'This is an error notification',
      type: 'error',
      actionUrl: null
    },
    {
      title: 'Reminder Test ⏰',
      message: 'Don\'t forget to log your mood today!',
      type: 'reminder',
      actionUrl: '/emotions'
    },
    {
      title: 'Achievement Test 🏆',
      message: 'You\'ve unlocked a new achievement!',
      type: 'achievement',
      actionUrl: '/gamification'
    },
    {
      title: 'Message Test 💬',
      message: 'You have a new message',
      type: 'message',
      actionUrl: '/circles'
    }
  ]

  const handleSendTest = async (notification) => {
    await createNotification(notification)
  }

  const handleSendAll = async () => {
    for (const notification of testNotifications) {
      await createNotification(notification)
      // Small delay between notifications
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-24 left-4 md:bottom-6 md:left-6 z-50 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors font-medium"
      >
        🧪 Show Notification Tests
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 left-4 md:bottom-6 md:left-6 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-purple-600" />
          <h3 className="font-bold text-text-primary dark:text-white">
            Notification Test Panel
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Stats */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary dark:text-gray-400">Total Notifications:</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">{notifications.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-text-secondary dark:text-gray-400">Unread:</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">{unreadCount}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <button
          onClick={handleSendAll}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors mb-2"
        >
          🚀 Send All Test Notifications
        </button>
        <p className="text-xs text-text-tertiary dark:text-gray-500 text-center">
          Sends all 7 notification types
        </p>
      </div>

      {/* Individual Tests */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        <p className="text-xs font-semibold text-text-secondary dark:text-gray-400 mb-2">
          Individual Tests:
        </p>
        {testNotifications.map((notification, index) => (
          <button
            key={index}
            onClick={() => handleSendTest(notification)}
            className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary dark:text-white">
                {notification.title}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                notification.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                notification.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                notification.type === 'achievement' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              }`}>
                {notification.type}
              </span>
            </div>
            <p className="text-xs text-text-tertiary dark:text-gray-500 mt-1">
              {notification.message}
            </p>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-text-tertiary dark:text-gray-500">
          💡 <strong>Tip:</strong> Click the bell icon in the header to see notifications.
          Open in 2 browser tabs to test real-time updates!
        </p>
      </div>

      {/* Remove Instructions */}
      <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
        <p className="text-xs text-yellow-800 dark:text-yellow-300">
          ⚠️ <strong>Development Only:</strong> Remove this component before production
        </p>
      </div>
    </div>
  )
}
