-- Gratitude Journal Schema

CREATE TABLE IF NOT EXISTS gratitude_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  items JSONB NOT NULL, -- [string] - 3-5 gratitude items
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_gratitude_user_date ON gratitude_entries(user_id, date DESC);

ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gratitude entries" ON gratitude_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gratitude entries" ON gratitude_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gratitude entries" ON gratitude_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own gratitude entries" ON gratitude_entries FOR DELETE USING (auth.uid() = user_id);
