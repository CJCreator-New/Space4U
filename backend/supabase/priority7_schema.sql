-- Priority 7: Technical Enhancements

-- 28. Voice Journaling
CREATE TABLE voice_journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_url TEXT,
  transcription TEXT,
  duration INTEGER,
  mood_detected TEXT,
  emotions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. Offline Sync Queue
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  operation TEXT CHECK (operation IN ('insert', 'update', 'delete')) NOT NULL,
  data JSONB NOT NULL,
  synced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 30. PWA Subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Indexes
CREATE INDEX idx_voice_journals_user ON voice_journals(user_id, created_at);
CREATE INDEX idx_sync_queue_user ON sync_queue(user_id, synced);
CREATE INDEX idx_push_subscriptions_user ON push_subscriptions(user_id);

-- RLS Policies
ALTER TABLE voice_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their voice journals" ON voice_journals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their sync queue" ON sync_queue FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their subscriptions" ON push_subscriptions FOR ALL USING (auth.uid() = user_id);
