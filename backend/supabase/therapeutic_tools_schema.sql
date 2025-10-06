-- Therapeutic Tools Database Schema

-- CBT Thought Records
CREATE TABLE IF NOT EXISTS thought_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  situation TEXT NOT NULL,
  automatic_thought TEXT NOT NULL,
  emotions JSONB NOT NULL, -- [{emotion: string, intensity: number}]
  evidence_for TEXT,
  evidence_against TEXT,
  balanced_thought TEXT,
  outcome_emotions JSONB, -- [{emotion: string, intensity: number}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DBT Skills Practice
CREATE TABLE IF NOT EXISTS dbt_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_type TEXT NOT NULL, -- 'mindfulness', 'distress_tolerance', 'emotion_regulation', 'interpersonal_effectiveness'
  skill_name TEXT NOT NULL,
  situation TEXT,
  what_happened TEXT,
  skill_used TEXT NOT NULL,
  effectiveness INTEGER CHECK (effectiveness >= 1 AND effectiveness <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mindfulness Sessions
CREATE TABLE IF NOT EXISTS mindfulness_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL, -- 'meditation', 'body_scan', 'mindful_breathing', 'loving_kindness'
  duration INTEGER NOT NULL, -- in minutes
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 5),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 5),
  notes TEXT,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sleep Logs
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bedtime TIME NOT NULL,
  wake_time TIME NOT NULL,
  sleep_duration DECIMAL(4,2), -- hours
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  factors JSONB, -- ['caffeine', 'exercise', 'stress', 'screen_time']
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Crisis Safety Plans
CREATE TABLE IF NOT EXISTS crisis_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  warning_signs JSONB NOT NULL, -- [string]
  coping_strategies JSONB NOT NULL, -- [string]
  distractions JSONB, -- [string]
  support_contacts JSONB, -- [{name: string, phone: string, relationship: string}]
  professional_contacts JSONB, -- [{name: string, phone: string, type: string}]
  safe_environment TEXT,
  reasons_to_live JSONB, -- [string]
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mental Health Assessments
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- 'phq9', 'gad7', 'dass21', 'psqi'
  responses JSONB NOT NULL, -- question responses
  total_score INTEGER NOT NULL,
  severity_level TEXT, -- 'minimal', 'mild', 'moderate', 'severe'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_thought_records_user ON thought_records(user_id, created_at DESC);
CREATE INDEX idx_dbt_skills_user ON dbt_skills(user_id, created_at DESC);
CREATE INDEX idx_mindfulness_user ON mindfulness_sessions(user_id, created_at DESC);
CREATE INDEX idx_sleep_logs_user ON sleep_logs(user_id, date DESC);
CREATE INDEX idx_crisis_plans_user ON crisis_plans(user_id);
CREATE INDEX idx_assessments_user ON assessments(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE thought_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE dbt_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindfulness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own thought records" ON thought_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own thought records" ON thought_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own thought records" ON thought_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own thought records" ON thought_records FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own dbt skills" ON dbt_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dbt skills" ON dbt_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own dbt skills" ON dbt_skills FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own mindfulness sessions" ON mindfulness_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mindfulness sessions" ON mindfulness_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mindfulness sessions" ON mindfulness_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sleep logs" ON sleep_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sleep logs" ON sleep_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sleep logs" ON sleep_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sleep logs" ON sleep_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own crisis plans" ON crisis_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crisis plans" ON crisis_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crisis plans" ON crisis_plans FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
