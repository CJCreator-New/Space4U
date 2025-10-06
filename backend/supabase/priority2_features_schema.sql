-- Priority 2 Features Database Schema

-- Trigger Tracker
CREATE TABLE IF NOT EXISTS triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'person', 'place', 'event', 'situation', 'thought'
  description TEXT,
  coping_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trigger_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trigger_id UUID REFERENCES triggers(id) ON DELETE CASCADE,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 5),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 5),
  coping_used TEXT,
  effectiveness INTEGER CHECK (effectiveness >= 1 AND effectiveness <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journaling Prompts
CREATE TABLE IF NOT EXISTS journal_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt TEXT NOT NULL,
  category TEXT NOT NULL, -- 'anxiety', 'depression', 'relationships', 'growth', 'gratitude', 'reflection'
  difficulty TEXT, -- 'easy', 'medium', 'deep'
  is_default BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES journal_prompts(id),
  prompt_text TEXT,
  entry TEXT NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worry Time Scheduler
CREATE TABLE IF NOT EXISTS worry_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  worry TEXT NOT NULL,
  scheduled_time TIME,
  addressed BOOLEAN DEFAULT false,
  resolution TEXT,
  outcome TEXT, -- 'resolved', 'postponed', 'dismissed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Self-Compassion Exercises
CREATE TABLE IF NOT EXISTS self_compassion_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL, -- 'letter', 'prompt', 'meditation', 'affirmation'
  content TEXT NOT NULL,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 5),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Therapy Session Prep
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  therapist_name TEXT,
  topics_to_discuss JSONB, -- [string]
  goals JSONB, -- [string]
  homework JSONB, -- [{task: string, completed: boolean}]
  session_notes TEXT,
  post_session_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Tracker
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL, -- 'daily', 'twice_daily', 'weekly', 'as_needed'
  times JSONB NOT NULL, -- ['09:00', '21:00']
  purpose TEXT,
  prescriber TEXT,
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  taken BOOLEAN DEFAULT true,
  side_effects TEXT,
  effectiveness INTEGER CHECK (effectiveness >= 1 AND effectiveness <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(medication_id, date, time)
);

-- Indexes
CREATE INDEX idx_triggers_user ON triggers(user_id);
CREATE INDEX idx_trigger_logs_user ON trigger_logs(user_id, created_at DESC);
CREATE INDEX idx_journal_prompts_category ON journal_prompts(category);
CREATE INDEX idx_journal_entries_user ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_worry_logs_user ON worry_logs(user_id, addressed, created_at DESC);
CREATE INDEX idx_self_compassion_user ON self_compassion_logs(user_id, created_at DESC);
CREATE INDEX idx_therapy_sessions_user ON therapy_sessions(user_id, session_date DESC);
CREATE INDEX idx_medications_user ON medications(user_id, active);
CREATE INDEX idx_medication_logs_user ON medication_logs(user_id, date DESC);

-- Row Level Security
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE worry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_compassion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own triggers" ON triggers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own trigger logs" ON trigger_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view prompts" ON journal_prompts FOR SELECT USING (true);
CREATE POLICY "Users can manage own journal entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own worry logs" ON worry_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own self compassion logs" ON self_compassion_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own therapy sessions" ON therapy_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own medications" ON medications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own medication logs" ON medication_logs FOR ALL USING (auth.uid() = user_id);

-- Seed Journal Prompts
INSERT INTO journal_prompts (prompt, category, difficulty) VALUES
('What am I grateful for today?', 'gratitude', 'easy'),
('What is causing me anxiety right now?', 'anxiety', 'easy'),
('How did I take care of myself today?', 'reflection', 'easy'),
('What would I tell a friend in my situation?', 'growth', 'medium'),
('What are my core values and am I living by them?', 'growth', 'deep'),
('What patterns do I notice in my relationships?', 'relationships', 'deep'),
('What am I avoiding and why?', 'reflection', 'deep'),
('What small win can I celebrate today?', 'gratitude', 'easy'),
('What emotions am I feeling right now?', 'reflection', 'easy'),
('What do I need to forgive myself for?', 'growth', 'deep')
ON CONFLICT DO NOTHING;
