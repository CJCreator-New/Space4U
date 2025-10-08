-- ============================================
-- ENABLE REAL-TIME FOR SPACE4U
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable real-time for posts table
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Enable real-time for comments table
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- Enable real-time for circle_members table
ALTER PUBLICATION supabase_realtime ADD TABLE circle_members;

-- ============================================
-- DONE! ✅
-- ============================================
-- Real-time updates now enabled for:
-- - New posts in circles
-- - New comments on posts
-- - Circle membership changes
