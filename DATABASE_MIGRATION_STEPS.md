# Database Migration Steps - Notifications Table

## ⚠️ IMPORTANT: Do This Now Before Testing

Follow these steps to set up the notifications table in Supabase:

---

## Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your **Space4U** project
3. In the left sidebar, click **SQL Editor**
4. Click **New Query** button

---

## Step 2: Run the Migration

**Option A: Copy from File**
1. The migration SQL is already open in VS Code
2. Select all text (Ctrl+A)
3. Copy (Ctrl+C)
4. Paste into Supabase SQL Editor
5. Click **Run** button (or press Ctrl+Enter)

**Option B: Use This SQL**
```sql
-- Create notifications table for the Space4U app
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'reminder', 'achievement', 'message')),
  action_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only read their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own notifications (for app-generated notifications)
CREATE POLICY "Users can create their own notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to send real-time notifications
CREATE OR REPLACE FUNCTION notify_notification_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- This will trigger Supabase real-time subscriptions
  PERFORM pg_notify('notification_changes', NEW.user_id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for real-time notifications
CREATE TRIGGER notification_changes
  AFTER INSERT OR UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION notify_notification_changes();

COMMENT ON TABLE notifications IS 'Stores user notifications for the Space4U mental health app';
COMMENT ON COLUMN notifications.type IS 'Type of notification: info, success, warning, error, reminder, achievement, message';
COMMENT ON COLUMN notifications.action_url IS 'Optional URL to navigate to when notification is clicked';
COMMENT ON COLUMN notifications.read IS 'Whether the notification has been read by the user';
```

---

## Step 3: Verify Migration Success

After running the SQL, you should see:
- ✅ "Success. No rows returned"
- Or check the **Table Editor** in left sidebar
- Click **notifications** table - it should now exist

---

## Step 4: Enable Realtime (Optional but Recommended)

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Find the **notifications** table in the list
3. Toggle **Realtime** to ON (green)
4. This enables live updates without page refresh

---

## Step 5: Create Test Notification

**Option 1: Via SQL (Quick Test)**
```sql
-- Replace 'your-user-id-here' with your actual user ID
-- You can find your user ID in Authentication > Users

INSERT INTO notifications (user_id, title, message, type, action_url)
VALUES (
  'your-user-id-here',  -- ← CHANGE THIS
  'Test Notification 🎉',
  'If you see this, the notification system works!',
  'success',
  '/'
);
```

**Option 2: Via App UI (After Step 6)**
- Create a button in your app that calls `createNotification()`
- See NOTIFICATION_SYSTEM_GUIDE.md for examples

---

## Step 6: Test in App

1. Start your dev server (if not running):
   ```powershell
   npm run dev
   ```

2. Open app in browser: `http://localhost:5174`

3. Log in to your account

4. Look for:
   - 🔔 **Bell icon in header** (NotificationCenter)
   - 🆘 **Red crisis button** (bottom-right)

5. If you created a test notification in Step 5:
   - Click the bell icon
   - You should see your test notification!

---

## Verification Checklist

- [ ] SQL migration ran successfully without errors
- [ ] `notifications` table appears in Supabase Table Editor
- [ ] Realtime is enabled for notifications table
- [ ] Test notification created via SQL
- [ ] Bell icon appears in app header
- [ ] Crisis button appears in bottom-right
- [ ] Clicking bell shows notification dropdown
- [ ] Test notification appears in dropdown
- [ ] Can mark notification as read
- [ ] Can delete notification
- [ ] Navigate to `/notifications` page works

---

## Troubleshooting

### Error: "relation 'notifications' already exists"
**Solution:** The table was already created. This is fine! The migration uses `CREATE TABLE IF NOT EXISTS`.

### Error: "permission denied for schema public"
**Solution:** Make sure you're the project owner or have sufficient permissions in Supabase.

### Error: "relation 'auth.users' does not exist"
**Solution:** This shouldn't happen in Supabase. Check that you're running the SQL in the correct project.

### Bell icon not showing in app
**Solution:** 
1. Check browser console for errors
2. Verify NotificationCenter is imported in Layout.jsx
3. Hard refresh browser (Ctrl+Shift+R)

### Notifications not loading
**Solution:**
1. Check browser console for Supabase errors
2. Verify you're logged in (check `useSupabaseAuth()`)
3. Verify RLS policies were created (check Supabase Dashboard → Authentication → Policies)

---

## Next Steps After Migration

Once migration is complete and verified:

1. **Set up automated notifications** (daily reminders, achievements)
2. **Customize crisis resources** for your region/language
3. **Enhance dashboard** with personalized widgets
4. **Move to next feature**: Emotions Module Enhancement

---

## Quick Reference

**Create notification from code:**
```javascript
const { createNotification } = useNotifications()

await createNotification({
  title: 'Achievement Unlocked!',
  message: '7-day streak completed!',
  type: 'achievement',
  actionUrl: '/gamification'
})
```

**Get current user ID for testing:**
```sql
SELECT id, email FROM auth.users LIMIT 5;
```

---

**Status After This Step:**
- ✅ Database schema created
- ✅ Notification system ready
- ✅ Crisis support ready
- ✅ Ready for testing and enhancement

---

*Once you complete these steps, mark the todo as complete and we'll move on to testing and the next enhancement!*
