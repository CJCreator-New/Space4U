CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  age_confirmed BOOLEAN DEFAULT false,
  interests TEXT[],
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE moods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles NOT NULL,
  date DATE NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  emoji TEXT NOT NULL,
  label TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE TABLE circles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE circle_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  circle_id UUID REFERENCES circles NOT NULL,
  user_id UUID REFERENCES profiles NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(circle_id, user_id)
);

CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles NOT NULL,
  circle_id UUID REFERENCES circles NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts NOT NULL,
  user_id UUID REFERENCES profiles NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles NOT NULL,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users view own moods" ON moods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own moods" ON moods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Posts viewable by all" ON posts FOR SELECT USING (true);
CREATE POLICY "Users create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Comments viewable by all" ON comments FOR SELECT USING (true);
CREATE POLICY "Users create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_moods_user_date ON moods(user_id, date DESC);
CREATE INDEX idx_posts_circle ON posts(circle_id, created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id, created_at DESC);
