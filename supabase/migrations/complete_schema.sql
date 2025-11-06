-- Space4U Complete Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  age_confirmed BOOLEAN DEFAULT false,
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- MOODS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS moods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_value INTEGER NOT NULL CHECK (mood_value >= 1 AND mood_value <= 5),
  note TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_moods_user_id ON moods(user_id);
CREATE INDEX idx_moods_created_at ON moods(created_at DESC);
CREATE INDEX idx_moods_user_date ON moods(user_id, created_at DESC);

ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own moods"
  ON moods FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own moods"
  ON moods FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own moods"
  ON moods FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own moods"
  ON moods FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CIRCLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS circles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  category TEXT,
  tags TEXT[],
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_circles_category ON circles(category);

ALTER TABLE circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Circles are viewable by everyone"
  ON circles FOR SELECT USING (true);

-- ============================================
-- CIRCLE MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS circle_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(circle_id, user_id)
);

CREATE INDEX idx_circle_members_circle ON circle_members(circle_id);
CREATE INDEX idx_circle_members_user ON circle_members(user_id);

ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Circle members are viewable by everyone"
  ON circle_members FOR SELECT USING (true);

CREATE POLICY "Users can join circles"
  ON circle_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave circles"
  ON circle_members FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  reactions JSONB DEFAULT '{}',
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_circle_id ON posts(circle_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- GRATITUDE ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gratitude_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood_correlation INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gratitude_user_id ON gratitude_entries(user_id);
CREATE INDEX idx_gratitude_created_at ON gratitude_entries(created_at DESC);

ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gratitude entries"
  ON gratitude_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own gratitude entries"
  ON gratitude_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gratitude entries"
  ON gratitude_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gratitude entries"
  ON gratitude_entries FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- HABITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily',
  streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  completed_dates JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_habits_user_id ON habits(user_id);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circles_updated_at
  BEFORE UPDATE ON circles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS FOR COUNTERS
-- ============================================

-- Update circle member count
CREATE OR REPLACE FUNCTION update_circle_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE circles SET member_count = member_count + 1 WHERE id = NEW.circle_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE circles SET member_count = member_count - 1 WHERE id = OLD.circle_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_circle_member_count_trigger
  AFTER INSERT OR DELETE ON circle_members
  FOR EACH ROW EXECUTE FUNCTION update_circle_member_count();

-- Update post comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comment_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Insert default circles
INSERT INTO circles (name, description, icon, color, category, tags) VALUES
  ('Anxiety Support', 'Safe space for managing anxiety and stress', '🌊', '#6366F1', 'mental-health', ARRAY['Breathing', 'Mindfulness', 'CBT']),
  ('Depression Corner', 'You''re not alone in this journey', '🌱', '#8B5CF6', 'mental-health', ARRAY['Daily Wins', 'Motivation', 'Peer Support']),
  ('Work & Career Stress', 'Navigate workplace challenges together', '💼', '#3B82F6', 'lifestyle', ARRAY['Burnout', 'Boundaries', 'Productivity']),
  ('Relationship Talk', 'Love, family, and friendship support', '❤️', '#EC4899', 'support', ARRAY['Communication', 'Conflict', 'Boundaries']),
  ('Student Life', 'Academic pressure and campus struggles', '📚', '#F59E0B', 'lifestyle', ARRAY['Study Tips', 'Isolation', 'Dorm Life']),
  ('LGBTQ+ Safe Space', 'Acceptance, understanding, belonging', '🏳️‍🌈', '#EF4444', 'support', ARRAY['Identity', 'Community', 'Joy']),
  ('New Parents', 'Parenting wins and struggles', '👶', '#10B981', 'lifestyle', ARRAY['Sleep', 'Feeding', 'Support']),
  ('General Wellness', 'Daily life and self-care', '✨', '#14B8A6', 'mental-health', ARRAY['Routines', 'Mindset', 'Gratitude'])
ON CONFLICT DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE profiles IS 'User profiles with customization options';
COMMENT ON TABLE moods IS 'Daily mood tracking entries';
COMMENT ON TABLE circles IS 'Support communities and groups';
COMMENT ON TABLE circle_members IS 'User memberships in circles';
COMMENT ON TABLE posts IS 'User posts within circles';
COMMENT ON TABLE comments IS 'Comments on posts';
COMMENT ON TABLE gratitude_entries IS 'Daily gratitude journal entries';
COMMENT ON TABLE habits IS 'User habit tracking';

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Space4U database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Enable Realtime for: notifications, posts, comments, moods';
  RAISE NOTICE '2. Configure authentication providers';
  RAISE NOTICE '3. Set up storage buckets for avatars';
END $$;
