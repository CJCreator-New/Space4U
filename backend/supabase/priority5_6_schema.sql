-- Priority 5 & 6: Advanced Analytics + Professional Integration

-- 23. Tag Analytics (computed from moods table)
CREATE TABLE mood_tag_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  mood_level INTEGER,
  frequency INTEGER DEFAULT 1,
  last_used TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tag, mood_level)
);

-- 24. Sleep Pattern Analytics (computed from sleep_logs)
CREATE TABLE sleep_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  avg_quality DECIMAL(3,2),
  total_hours DECIMAL(4,2),
  sleep_debt DECIMAL(4,2),
  optimal_bedtime TIME,
  factors JSONB DEFAULT '{}',
  UNIQUE(user_id, date)
);

-- 25. Therapist Portal
CREATE TABLE therapist_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  specialization TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_therapist_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES therapist_accounts(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'active', 'paused', 'ended')) DEFAULT 'pending',
  data_sharing_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, therapist_id)
);

CREATE TABLE therapist_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES client_therapist_links(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. Crisis Hotline Integration
CREATE TABLE crisis_hotlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL,
  region TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  chat_url TEXT,
  available_24_7 BOOLEAN DEFAULT TRUE,
  languages TEXT[] DEFAULT ARRAY['English']
);

-- 27. Data Export Logs
CREATE TABLE export_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT CHECK (export_type IN ('pdf', 'csv', 'json')) NOT NULL,
  data_types TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mood_tag_analytics_user ON mood_tag_analytics(user_id);
CREATE INDEX idx_sleep_analytics_user ON sleep_analytics(user_id, date);
CREATE INDEX idx_therapist_accounts_user ON therapist_accounts(user_id);
CREATE INDEX idx_client_therapist_links ON client_therapist_links(client_id, therapist_id);
CREATE INDEX idx_crisis_hotlines_country ON crisis_hotlines(country);

-- RLS Policies
ALTER TABLE mood_tag_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_therapist_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_hotlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their analytics" ON mood_tag_analytics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their sleep analytics" ON sleep_analytics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view therapist accounts" ON therapist_accounts FOR SELECT USING (TRUE);
CREATE POLICY "Users manage their links" ON client_therapist_links FOR ALL USING (auth.uid() = client_id);
CREATE POLICY "Users view their assignments" ON therapist_assignments FOR SELECT USING (EXISTS (SELECT 1 FROM client_therapist_links WHERE id = link_id AND client_id = auth.uid()));
CREATE POLICY "Anyone can view hotlines" ON crisis_hotlines FOR SELECT USING (TRUE);
CREATE POLICY "Users manage their exports" ON export_logs FOR ALL USING (auth.uid() = user_id);

-- Seed crisis hotlines
INSERT INTO crisis_hotlines (country, name, phone, available_24_7) VALUES
('US', 'National Suicide Prevention Lifeline', '988', TRUE),
('US', 'Crisis Text Line', '741741', TRUE),
('UK', 'Samaritans', '116123', TRUE),
('CA', 'Crisis Services Canada', '1-833-456-4566', TRUE),
('AU', 'Lifeline Australia', '13-11-14', TRUE);
