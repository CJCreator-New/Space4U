-- Priority 3: Gamification Features Database Schema

-- Wellness Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL, -- 7, 30, etc
  challenge_type TEXT NOT NULL, -- 'mood_tracking', 'habit_building', 'gratitude', 'mindfulness'
  goal_target INTEGER NOT NULL,
  badge_reward TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(challenge_id, user_id)
);

-- Streak Rewards System
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL, -- 'mood_tracking', 'gratitude', 'habits', 'overall'
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_activities INTEGER DEFAULT 0,
  milestones_reached JSONB DEFAULT '[]', -- [10, 30, 100, etc]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- Mental Health Quest System
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  level_required INTEGER DEFAULT 1,
  xp_reward INTEGER NOT NULL,
  badge_reward TEXT,
  tasks JSONB NOT NULL, -- [{task: string, type: string, target: number}]
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  progress JSONB NOT NULL, -- {task_id: completed_count}
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, quest_id)
);

CREATE TABLE IF NOT EXISTS user_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom Mood Scales
CREATE TABLE IF NOT EXISTS custom_mood_scales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scale_type TEXT NOT NULL, -- 'numeric', 'emoji', 'descriptive'
  min_value INTEGER DEFAULT 1,
  max_value INTEGER DEFAULT 5,
  labels JSONB NOT NULL, -- {1: 'label', 2: 'label', ...}
  emojis JSONB, -- {1: 'emoji', 2: 'emoji', ...}
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wellness Plan Builder
CREATE TABLE IF NOT EXISTS wellness_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plan_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES wellness_plans(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'morning_ritual', 'evening_ritual', 'daily_task'
  title TEXT NOT NULL,
  time TIME,
  duration INTEGER, -- minutes
  days JSONB NOT NULL, -- [0,1,2,3,4,5,6]
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plan_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES plan_activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, date)
);

-- Indexes
CREATE INDEX idx_challenges_active ON challenges(is_active, start_date);
CREATE INDEX idx_challenge_participants_user ON challenge_participants(user_id, challenge_id);
CREATE INDEX idx_user_streaks_user ON user_streaks(user_id, streak_type);
CREATE INDEX idx_quests_category ON quests(category, level_required);
CREATE INDEX idx_user_quest_progress_user ON user_quest_progress(user_id, completed);
CREATE INDEX idx_user_levels_user ON user_levels(user_id);
CREATE INDEX idx_custom_mood_scales_user ON custom_mood_scales(user_id);
CREATE INDEX idx_wellness_plans_user ON wellness_plans(user_id, is_active);
CREATE INDEX idx_plan_activities_plan ON plan_activities(plan_id);
CREATE INDEX idx_plan_completions_activity ON plan_completions(activity_id, date);

-- Row Level Security
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_mood_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active challenges" ON challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own challenge participation" ON challenge_participants FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own streaks" ON user_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view quests" ON quests FOR SELECT USING (true);
CREATE POLICY "Users can manage own quest progress" ON user_quest_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own levels" ON user_levels FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mood scales" ON custom_mood_scales FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wellness plans" ON wellness_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view plan activities" ON plan_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM wellness_plans WHERE wellness_plans.id = plan_activities.plan_id AND wellness_plans.user_id = auth.uid())
);
CREATE POLICY "Users can manage plan activities" ON plan_activities FOR ALL USING (
  EXISTS (SELECT 1 FROM wellness_plans WHERE wellness_plans.id = plan_activities.plan_id AND wellness_plans.user_id = auth.uid())
);
CREATE POLICY "Users can manage own plan completions" ON plan_completions FOR ALL USING (auth.uid() = user_id);

-- Seed Default Challenges
INSERT INTO challenges (title, description, duration_days, challenge_type, goal_target, badge_reward, is_active) VALUES
('7-Day Mood Tracker', 'Track your mood every day for 7 days', 7, 'mood_tracking', 7, '🎯 Mood Master', true),
('30-Day Gratitude Challenge', 'Write 3 gratitude items daily for 30 days', 30, 'gratitude', 30, '🙏 Gratitude Guru', true),
('Mindfulness Week', 'Complete 5 mindfulness sessions in 7 days', 7, 'mindfulness', 5, '🧘 Zen Master', true),
('Habit Builder', 'Complete all your habits for 14 days straight', 14, 'habit_building', 14, '💪 Habit Hero', true)
ON CONFLICT DO NOTHING;

-- Seed Default Quests
INSERT INTO quests (title, description, category, level_required, xp_reward, badge_reward, tasks, is_premium) VALUES
('Getting Started', 'Complete your first week on Space4U', 'beginner', 1, 100, '🌟 Newcomer', '[{"task":"Log 3 moods","type":"mood","target":3},{"task":"Join a circle","type":"circle","target":1}]', false),
('Wellness Warrior', 'Use 5 different wellness tools', 'intermediate', 5, 250, '⚔️ Warrior', '[{"task":"Use 5 tools","type":"tools","target":5}]', false),
('Master of Mindfulness', 'Complete 20 mindfulness sessions', 'advanced', 10, 500, '🧘 Master', '[{"task":"Mindfulness sessions","type":"mindfulness","target":20}]', true)
ON CONFLICT DO NOTHING;
