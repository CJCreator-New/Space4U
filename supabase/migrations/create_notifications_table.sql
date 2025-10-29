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

-- Insert sample notifications for testing (optional)
-- Uncomment the following lines if you want to test with sample data

/*
INSERT INTO notifications (user_id, title, message, type, action_url)
VALUES
  (auth.uid(), 'Welcome to Space4U! 🎉', 'Thanks for joining us on your mental wellness journey.', 'success', '/'),
  (auth.uid(), 'Complete your profile', 'Add more information to personalize your experience.', 'info', '/profile'),
  (auth.uid(), 'Daily check-in reminder', 'How are you feeling today? Take a moment to log your mood.', 'reminder', '/emotions'),
  (auth.uid(), 'New achievement unlocked! 🏆', 'You''ve completed your first week of daily check-ins!', 'achievement', '/gamification');
*/

COMMENT ON TABLE notifications IS 'Stores user notifications for the Space4U mental health app';
COMMENT ON COLUMN notifications.type IS 'Type of notification: info, success, warning, error, reminder, achievement, message';
COMMENT ON COLUMN notifications.action_url IS 'Optional URL to navigate to when notification is clicked';
COMMENT ON COLUMN notifications.read IS 'Whether the notification has been read by the user';
