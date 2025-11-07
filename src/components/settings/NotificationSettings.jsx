import { useState } from 'react'
import { Bell, Zap } from 'lucide-react'

function NotificationSettings({ settings, updateSetting, isSettingModified }) {
  return (
    <div className="border-t border-gray-100">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-medium">Daily reminder</h3>
              <p className="text-sm text-gray-600">Get reminded to journal daily</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.dailyReminder}
            onChange={(e) => updateSetting('notifications', 'dailyReminder', e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
        </div>

        {settings.notifications.dailyReminder && (
          <>
            <div className="flex items-center justify-between ml-8">
              <span className="text-sm">Reminder time</span>
              <input
                type="time"
                value={settings.notifications.reminderTime}
                onChange={(e) => updateSetting('notifications', 'reminderTime', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
              />
            </div>

            <div className="flex items-center justify-between ml-8">
              <span className="text-sm">Reminder days</span>
              <select
                value={settings.notifications.reminderDays}
                onChange={(e) => updateSetting('notifications', 'reminderDays', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays only</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-medium">Circle activity</h3>
              <p className="text-sm text-gray-600">Notifications from your circles</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.circleActivity}
            onChange={(e) => updateSetting('notifications', 'circleActivity', e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
        </div>

        {settings.notifications.circleActivity && (
          <>
            <div className="flex items-center justify-between ml-8">
              <span className="text-sm">New posts in my circles</span>
              <input
                type="checkbox"
                checked={settings.notifications.newPosts}
                onChange={(e) => updateSetting('notifications', 'newPosts', e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between ml-8">
              <span className="text-sm">Replies to my posts</span>
              <input
                type="checkbox"
                checked={settings.notifications.replies}
                onChange={(e) => updateSetting('notifications', 'replies', e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between ml-8">
              <span className="text-sm">Hearts on my content</span>
              <input
                type="checkbox"
                checked={settings.notifications.hearts}
                onChange={(e) => updateSetting('notifications', 'hearts', e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-medium">Wellness nudges</h3>
              <p className="text-sm text-gray-600">Motivational reminders and streak alerts</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.wellnessNudges}
            onChange={(e) => updateSetting('notifications', 'wellnessNudges', e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-medium">Crisis alerts</h3>
              <p className="text-sm text-gray-600">Important safety alerts (always on)</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={true}
            disabled={true}
            className="w-5 h-5 text-primary rounded focus:ring-primary opacity-50 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings