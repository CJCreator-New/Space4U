import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../contexts/NotificationContext'
import { Bell, Check, CheckCheck, Trash2, Filter, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow, format } from 'date-fns'
import PageWrapper from '../components/PageWrapper'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications()

  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false
    if (filter === 'read' && !notification.read) return false
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false
    return true
  })

  const notificationTypes = ['all', 'info', 'success', 'warning', 'error', 'reminder', 'achievement', 'message']

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      reminder: '⏰',
      achievement: '🏆',
      message: '💬'
    }
    return icons[type] || icons.info
  }

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id)
    if (notification.action_url) {
      navigate(notification.action_url)
    }
  }

  return (
    <PageWrapper title="Notifications">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-white flex items-center gap-3">
                <Bell size={32} />
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-text-secondary dark:text-gray-400 mt-1">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <CheckCheck size={18} />
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Trash2 size={18} />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-text-secondary dark:text-gray-400" />
            <span className="font-medium text-text-primary dark:text-white">Filters</span>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Read/Unread Filter */}
            <div className="flex gap-2">
              {['all', 'unread', 'read'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-text-secondary dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <Bell size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-2">
              {notifications.length === 0 ? 'No notifications yet' : 'No notifications match your filters'}
            </h3>
            <p className="text-text-secondary dark:text-gray-400">
              {notifications.length === 0
                ? "We'll notify you when something important happens"
                : 'Try adjusting your filters to see more notifications'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all cursor-pointer group ${
                  !notification.read ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}

                  {/* Icon */}
                  <div className="text-4xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-lg text-text-primary dark:text-white">
                        {notification.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                        notification.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                        notification.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                        notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                        notification.type === 'achievement' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                        'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}>
                        {notification.type}
                      </span>
                    </div>

                    {notification.message && (
                      <p className="text-text-secondary dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-text-tertiary dark:text-gray-500">
                        <span title={format(new Date(notification.created_at), 'PPpp')}>
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                        {notification.action_url && (
                          <span className="text-primary dark:text-primary-light">Click to view →</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} className="text-blue-600 dark:text-blue-400" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {notifications.length > 0 && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-text-secondary dark:text-gray-400">
              <span>
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </span>
              <span>
                {unreadCount} unread • {notifications.length - unreadCount} read
              </span>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
