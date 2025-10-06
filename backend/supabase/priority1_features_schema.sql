-- Priority 1 Features Database Schema

-- Habit Tracker
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'custom'
  target_days JSONB, -- [0,1,2,3,4,5,6] for weekly
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- Emotion Wheel/Tracker
CREATE TABLE IF NOT EXISTS emotion_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_emotion TEXT NOT NULL,
  secondary_emotions JSONB, -- [string]
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  duration INTEGER, -- minutes
  trigger TEXT,
  context TEXT,
  coping_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart Reminders
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'mood_checkin', 'medication', 'therapy', 'habit', 'custom'
  title TEXT NOT NULL,
  description TEXT,
  time TIME NOT NULL,
  days JSONB NOT NULL, -- [0,1,2,3,4,5,6]
  enabled BOOLEAN DEFAULT true,
  reference_id UUID, -- habit_id or medication_id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coping Skills Library
CREATE TABLE IF NOT EXISTS coping_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'grounding', 'distraction', 'relaxation', 'social', 'physical'
  situation JSONB, -- ['anxiety', 'depression', 'anger', 'stress']
  difficulty TEXT, -- 'easy', 'medium', 'hard'
  duration INTEGER, -- minutes
  instructions TEXT,
  is_default BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_coping_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coping_skill_id UUID REFERENCES coping_skills(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  times_used INTEGER DEFAULT 0,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coping_skill_id)
);

-- Indexes
CREATE INDEX idx_habits_user ON habits(user_id, created_at DESC);
CREATE INDEX idx_habit_completions_habit_date ON habit_completions(habit_id, date DESC);
CREATE INDEX idx_emotion_logs_user ON emotion_logs(user_id, created_at DESC);
CREATE INDEX idx_reminders_user ON reminders(user_id, enabled);
CREATE INDEX idx_coping_skills_category ON coping_skills(category, situation);
CREATE INDEX idx_user_coping_skills_user ON user_coping_skills(user_id, is_favorite);

-- Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coping_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Habits
CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own completions" ON habit_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON habit_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own completions" ON habit_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own completions" ON habit_completions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies - Emotions
CREATE POLICY "Users can view own emotions" ON emotion_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emotions" ON emotion_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own emotions" ON emotion_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies - Reminders
CREATE POLICY "Users can view own reminders" ON reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON reminders FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies - Coping Skills
CREATE POLICY "Anyone can view coping skills" ON coping_skills FOR SELECT USING (true);
CREATE POLICY "Users can view own user coping skills" ON user_coping_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user coping skills" ON user_coping_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user coping skills" ON user_coping_skills FOR UPDATE USING (auth.uid() = user_id);

-- Seed Default Coping Skills
INSERT INTO coping_skills (name, description, category, situation, difficulty, duration, instructions) VALUES
('Deep Breathing', '4-7-8 breathing technique', 'relaxation', '["anxiety","stress","panic"]', 'easy', 5, 'Breathe in for 4, hold for 7, exhale for 8'),
('5-4-3-2-1 Grounding', 'Sensory grounding technique', 'grounding', '["anxiety","panic","dissociation"]', 'easy', 5, 'Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste'),
('Progressive Muscle Relaxation', 'Tense and release muscle groups', 'relaxation', '["anxiety","stress","tension"]', 'medium', 15, 'Systematically tense and relax each muscle group'),
('Call a Friend', 'Reach out for social support', 'social', '["loneliness","sadness","anxiety"]', 'easy', 20, 'Call or text a trusted friend or family member'),
('Go for a Walk', 'Physical activity and fresh air', 'physical', '["stress","anger","restlessness"]', 'easy', 15, 'Take a 15-minute walk outside'),
('Journaling', 'Write down thoughts and feelings', 'distraction', '["overwhelm","confusion","sadness"]', 'easy', 10, 'Free write for 10 minutes without judgment'),
('Listen to Music', 'Calming or uplifting music', 'distraction', '["stress","sadness","anxiety"]', 'easy', 10, 'Listen to your favorite calming playlist'),
('Cold Water Splash', 'Splash cold water on face', 'grounding', '["panic","dissociation","overwhelm"]', 'easy', 2, 'Splash cold water on your face or hold ice'),
('Mindful Observation', 'Focus on one object', 'grounding', '["anxiety","racing thoughts"]', 'easy', 5, 'Choose an object and observe it in detail for 5 minutes'),
('Body Scan', 'Mental scan of body sensations', 'relaxation', '["stress","tension","insomnia"]', 'medium', 10, 'Mentally scan your body from head to toe')
ON CONFLICT DO NOTHING;
