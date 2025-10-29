import { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck, Trash2, X, Settings } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id)
    setIsOpen(false)
    if (notification.action_url) {
      navigate(notification.action_url)
    }
  }

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell size={24} className="text-text-secondary dark:text-gray-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary dark:text-white">
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck size={18} className="text-text-secondary dark:text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Clear all"
                    >
                      <Trash2 size={18} className="text-text-secondary dark:text-gray-400" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    navigate('/settings/notifications')
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Notification settings"
                >
                  <Settings size={18} className="text-text-secondary dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-text-secondary dark:text-gray-400">No notifications yet</p>
                  <p className="text-sm text-text-tertiary dark:text-gray-500 mt-1">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group relative animate__animated animate__fadeInUp ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20 animate__bounceIn' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                      )}

                      <div className="flex items-start gap-3 pl-4">
                        {/* Icon */}
                        <div className="text-2xl flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary dark:text-white text-sm">
                            {notification.title}
                          </p>
                          {notification.message && (
                            <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                          )}
                          <p className="text-xs text-text-tertiary dark:text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              title="Mark as read"
                            >
                              <Check size={16} className="text-text-secondary dark:text-gray-400" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <X size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    navigate('/notifications')
                  }}
                  className="w-full text-center text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
