# Space4U - Notification System Implementation Guide
## Setup & Usage Instructions

**Last Updated:** October 29, 2025  
**Version:** 1.0

---

## 🎉 What's Been Implemented

### 1. Real-Time Notification System ✅

A comprehensive notification system with:
- Real-time updates using Supabase subscriptions
- Dropdown notification center in the header
- Full-page notifications management
- Mark as read/unread, delete, clear all
- Filter by type and read status
- Click-to-navigate functionality
- Unread count badge
- Dark mode support

### 2. Crisis Support System ✅

Always-accessible emergency resources:
- Floating crisis support button on all pages
- Modal with crisis hotlines
- Direct call/text functionality
- International resources
- Emergency services information

### 3. Enhanced Navigation ✅

Improved navigation experience:
- Active route highlighting
- Smooth transitions
- Keyboard navigation
- ARIA accessibility labels
- Mobile and desktop optimized

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies ✅
```powershell
npm install date-fns
```
**Status:** Already completed

### Step 2: Database Migration ⚠️ REQUIRED

**Copy and run this SQL in your Supabase SQL Editor:**

Location: `supabase/migrations/create_notifications_table.sql`

This creates:
- `notifications` table with proper schema
- Row Level Security (RLS) policies
- Indexes for performance
- Real-time triggers
- Auto-update timestamps

### Step 3: Enable Realtime (Optional but Recommended)

In Supabase Dashboard:
1. Go to **Database → Replication**
2. Find the **notifications** table
3. Enable **Realtime**

This enables live notification updates without refreshing.

### Step 4: Test the System

```javascript
// In any component, use the notification hook:
import { useNotifications } from '../contexts/NotificationContext'

function TestComponent() {
  const { createNotification } = useNotifications()

  const sendTest = async () => {
    await createNotification({
      title: 'Test Notification',
      message: 'This is a test!',
      type: 'success',
      actionUrl: '/profile'
    })
  }

  return <button onClick={sendTest}>Send Test Notification</button>
}
```

---

## 📖 Usage Guide

### Creating Notifications

#### Client-Side (React Components)
```javascript
const { createNotification } = useNotifications()

// Success notification
await createNotification({
  title: 'Success!',
  message: 'Your changes have been saved',
  type: 'success',
  actionUrl: '/profile'
})

// Reminder notification
await createNotification({
  title: 'Daily Check-in',
  message: 'Time to log your mood!',
  type: 'reminder',
  actionUrl: '/emotions'
})

// Achievement notification
await createNotification({
  title: 'Achievement Unlocked! 🏆',
  message: '7-day streak completed!',
  type: 'achievement',
  actionUrl: '/gamification'
})
```

#### Server-Side (Database/Edge Functions)
```sql
-- Insert directly into database
INSERT INTO notifications (user_id, title, message, type, action_url)
VALUES (
  'user-uuid-here',
  'Weekly Summary',
  'Your weekly insights are ready!',
  'info',
  '/analytics'
);
```

### Notification Types

| Type | Icon | Description | Example Use |
|------|------|-------------|-------------|
| `info` | ℹ️ | General information | Tips, updates, news |
| `success` | ✅ | Success messages | Saved changes, completed actions |
| `warning` | ⚠️ | Important warnings | Approaching limits, requires attention |
| `error` | ❌ | Error messages | Failed actions, issues |
| `reminder` | ⏰ | Scheduled reminders | Daily check-ins, appointments |
| `achievement` | 🏆 | Gamification | Badges, streaks, milestones |
| `message` | 💬 | User messages | Community posts, replies |

### Managing Notifications

```javascript
const {
  notifications,      // Array of all notifications
  unreadCount,       // Number of unread notifications
  isLoading,         // Loading state
  markAsRead,        // Mark single notification as read
  markAllAsRead,     // Mark all notifications as read
  deleteNotification,// Delete single notification
  clearAll,          // Delete all notifications
  refreshNotifications // Manually refresh
} = useNotifications()

// Mark as read
await markAsRead(notificationId)

// Mark all as read
await markAllAsRead()

// Delete notification
await deleteNotification(notificationId)

// Clear all
await clearAll()

// Refresh manually (usually not needed due to real-time)
await refreshNotifications()
```

---

## 🔔 Automated Notifications

### Daily Reminders

Create a Supabase Edge Function or Cron Job:

```sql
-- Example: Send daily mood check-in reminders
CREATE OR REPLACE FUNCTION send_daily_mood_reminders()
RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, action_url)
  SELECT 
    u.id,
    'Daily Check-in 🌅',
    'How are you feeling today? Take a moment to log your mood.',
    'reminder',
    '/emotions'
  FROM auth.users u
  WHERE u.id NOT IN (
    -- Skip users who already logged mood today
    SELECT user_id FROM mood_logs 
    WHERE DATE(created_at) = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;

-- Schedule this to run daily at 9 AM using pg_cron or Edge Functions
```

### Streak Achievements

```javascript
// After user logs mood, check for streaks
const checkMoodStreaks = async (userId) => {
  const streak = await calculateUserStreak(userId)
  
  if ([7, 14, 30, 60, 90, 180, 365].includes(streak)) {
    await createNotification({
      title: `🔥 ${streak}-Day Streak!`,
      message: `Amazing! You've logged your mood for ${streak} days in a row!`,
      type: 'achievement',
      actionUrl: '/gamification'
    })
  }
}
```

### Weekly Insights

```javascript
// Send weekly summary (run via cron job)
const sendWeeklySummary = async (userId) => {
  const stats = await getWeeklyStats(userId)
  
  await createNotification({
    title: 'Your Week in Review 📊',
    message: `You logged ${stats.moodCount} moods and wrote ${stats.journalCount} journal entries!`,
    type: 'info',
    actionUrl: '/analytics'
  })
}
```

### Gratitude Prompts

```javascript
// Send evening gratitude reminder
const sendGratitudeReminder = async (userId) => {
  await createNotification({
    title: 'Gratitude Moment 🙏',
    message: 'What are you grateful for today?',
    type: 'reminder',
    actionUrl: '/gratitude'
  })
}
```

---

## 🆘 Crisis Support Customization

### Adding Resources

Edit `src/components/CrisisSupport.jsx`:

```javascript
const crisisResources = {
  en: [
    {
      name: 'Crisis Hotline Name',
      phone: '1-800-XXX-XXXX',
      description: '24/7 confidential support',
      type: 'call',      // 'call', 'text', or 'web'
      country: 'USA'
    },
    {
      name: 'Online Support',
      url: 'https://example.com/support',
      description: 'Chat support available',
      type: 'web',
      country: 'International'
    }
  ],
  es: [
    // Spanish resources
  ],
  // Add more languages
}
```

### Resource Types

- **call**: Shows "Call [number]" button → triggers phone dialer
- **text**: Shows "Text [number]" button → opens SMS app
- **web**: Shows "Visit Website" button → opens URL in new tab

---

## 🐛 Troubleshooting

### Notifications Not Showing?

**1. Check Database Connection**
```javascript
// Browser console:
const { data, error } = await supabase
  .from('notifications')
  .select('*')
console.log({ data, error })
```

**2. Verify User is Authenticated**
```javascript
const { user } = useSupabaseAuth()
console.log('User:', user)  // Should not be null
```

**3. Check RLS Policies**
- Go to Supabase Dashboard → Authentication → Policies
- Ensure policies exist for `notifications` table
- Verify policies allow SELECT, INSERT, UPDATE, DELETE for authenticated users

**4. Check Console for Errors**
- Open browser DevTools → Console
- Look for Supabase or NotificationContext errors

### Real-Time Not Working?

**1. Enable Realtime**
- Supabase Dashboard → Database → Replication
- Enable for `notifications` table

**2. Check Subscription**
- NotificationContext logs subscription status
- Look for: "Notification change:" in console

**3. Test Manually**
```javascript
// Insert notification via SQL editor
INSERT INTO notifications (user_id, title, message, type)
VALUES (
  'your-user-id-here',
  'Real-time Test',
  'If you see this without refreshing, real-time works!',
  'info'
);
```

### Crisis Button Not Visible?

**1. Check Component Import**
```javascript
// In Layout.jsx
import CrisisSupport from './CrisisSupport'
// Should be rendered: <CrisisSupport />
```

**2. Check z-index**
- Crisis button has `z-40`
- Ensure no other elements have higher z-index

**3. Check Position**
- Fixed at `bottom-20 right-4` (mobile)
- Fixed at `bottom-6 right-6` (desktop)

---

## 📊 Database Schema

### notifications Table

```sql
Column        | Type         | Description
--------------|--------------|---------------------------
id            | UUID         | Primary key
user_id       | UUID         | Foreign key to auth.users
title         | TEXT         | Notification title
message       | TEXT         | Notification message (optional)
type          | VARCHAR(50)  | Type of notification
action_url    | TEXT         | URL to navigate on click (optional)
read          | BOOLEAN      | Read status (default: false)
created_at    | TIMESTAMPTZ  | Creation timestamp
updated_at    | TIMESTAMPTZ  | Last update timestamp
```

### Indexes
- `idx_notifications_user_id` - Faster user queries
- `idx_notifications_read` - Faster unread queries
- `idx_notifications_created_at` - Faster date sorting

### Policies (RLS)
- SELECT: Users can view their own notifications
- INSERT: Users can create their own notifications
- UPDATE: Users can update their own notifications
- DELETE: Users can delete their own notifications

---

## 🎨 Customization

### Notification Colors

In `NotificationCenter.jsx` and `NotificationsPage.jsx`:

```javascript
// Customize badge colors by type
className={`${
  notification.type === 'success' 
    ? 'bg-green-100 dark:bg-green-900 text-green-700'
  : notification.type === 'error'
    ? 'bg-red-100 dark:bg-red-900 text-red-700'
  : notification.type === 'achievement'
    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700'
  : 'bg-blue-100 dark:bg-blue-900 text-blue-700'
}`}
```

### Notification Icons

In `getNotificationIcon()` function:

```javascript
const getNotificationIcon = (type) => {
  const icons = {
    success: '✅',      // Change to any emoji
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    reminder: '⏰',
    achievement: '🏆',
    message: '💬',
    // Add custom types:
    custom: '⭐'
  }
  return icons[type] || icons.info
}
```

---

## ✅ Testing Checklist

- [ ] Run database migration in Supabase
- [ ] Enable realtime for notifications table
- [ ] Create test notification via UI
- [ ] Create test notification via SQL
- [ ] Verify notification appears in dropdown
- [ ] Verify notification appears on /notifications page
- [ ] Test mark as read
- [ ] Test mark all as read
- [ ] Test delete notification
- [ ] Test clear all notifications
- [ ] Test clicking notification (navigation)
- [ ] Test unread count badge
- [ ] Test filters on notifications page
- [ ] Test crisis support button
- [ ] Test crisis modal opens
- [ ] Test crisis hotline buttons
- [ ] Test in mobile view (responsive)
- [ ] Test in dark mode
- [ ] Open app in 2 tabs, create notification in one, verify real-time update in other

---

## 📚 Files Modified

### New Files Created
- `src/contexts/NotificationContext.jsx`
- `src/components/NotificationCenter.jsx`
- `src/components/CrisisSupport.jsx`
- `src/pages/NotificationsPage.jsx`
- `supabase/migrations/create_notifications_table.sql`

### Modified Files
- `src/App.jsx` - Added NotificationProvider, NotificationsPage route
- `src/components/Layout.jsx` - Added NotificationCenter and CrisisSupport
- `package.json` - Added date-fns dependency

---

## 🔜 Next Steps

1. **Run database migration** ⚠️ **CRITICAL - DO THIS FIRST**
2. Test notification system thoroughly
3. Set up automated notifications (daily reminders, achievements)
4. Customize crisis resources for your region/language
5. Consider implementing push notifications (PWA)
6. Add notification preferences page (/settings/notifications)

---

## 🤝 Need Help?

Common issues are covered in the Troubleshooting section above.

For implementation questions, check:
- Inline code comments in the components
- [ENHANCEMENT_ROADMAP.md](./ENHANCEMENT_ROADMAP.md) for overall plan
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database setup

---

**Implementation Status:** ✅ Complete and Ready for Testing

*Remember to run the database migration before using the notification system!*
