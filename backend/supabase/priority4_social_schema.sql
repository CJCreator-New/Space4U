-- Priority 4: Social & Community Features Schema

-- 18. Accountability Partner System
CREATE TABLE accountability_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'active', 'paused', 'ended')) DEFAULT 'pending',
  pairing_type TEXT CHECK (pairing_type IN ('anonymous', 'identified')) DEFAULT 'anonymous',
  shared_goals JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE partner_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pair_id UUID REFERENCES accountability_pairs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  goals_completed JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Peer Support Matching
CREATE TABLE peer_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  shared_challenges JSONB DEFAULT '[]',
  status TEXT CHECK (status IN ('matched', 'chatting', 'ended')) DEFAULT 'matched',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE peer_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES peer_matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Support Request System
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  circle_id TEXT,
  is_anonymous BOOLEAN DEFAULT TRUE,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'crisis')) DEFAULT 'medium',
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'responded', 'resolved', 'escalated')) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE support_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES support_requests(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Mood-Based Suggestions (stored user patterns)
CREATE TABLE user_mood_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 5),
  common_triggers JSONB DEFAULT '[]',
  effective_activities JSONB DEFAULT '[]',
  preferred_tools JSONB DEFAULT '[]',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mood_level)
);

CREATE TABLE suggestion_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_level INTEGER,
  suggestion_type TEXT,
  suggestion_content TEXT,
  was_helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_accountability_pairs_users ON accountability_pairs(user1_id, user2_id);
CREATE INDEX idx_partner_checkins_pair ON partner_checkins(pair_id);
CREATE INDEX idx_peer_matches_users ON peer_matches(user1_id, user2_id);
CREATE INDEX idx_peer_messages_match ON peer_messages(match_id);
CREATE INDEX idx_support_requests_user ON support_requests(user_id);
CREATE INDEX idx_support_requests_status ON support_requests(status);
CREATE INDEX idx_support_responses_request ON support_responses(request_id);
CREATE INDEX idx_user_mood_patterns_user ON user_mood_patterns(user_id);

-- RLS Policies
ALTER TABLE accountability_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mood_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pairs" ON accountability_pairs FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create pairs" ON accountability_pairs FOR INSERT WITH CHECK (auth.uid() = user1_id);
CREATE POLICY "Users can update their pairs" ON accountability_pairs FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can view checkins in their pairs" ON partner_checkins FOR SELECT USING (EXISTS (SELECT 1 FROM accountability_pairs WHERE id = pair_id AND (user1_id = auth.uid() OR user2_id = auth.uid())));
CREATE POLICY "Users can create checkins" ON partner_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their matches" ON peer_matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can view messages in their matches" ON peer_messages FOR SELECT USING (EXISTS (SELECT 1 FROM peer_matches WHERE id = match_id AND (user1_id = auth.uid() OR user2_id = auth.uid())));
CREATE POLICY "Users can send messages" ON peer_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view support requests" ON support_requests FOR SELECT USING (TRUE);
CREATE POLICY "Users can create support requests" ON support_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their requests" ON support_requests FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view responses" ON support_responses FOR SELECT USING (TRUE);
CREATE POLICY "Users can create responses" ON support_responses FOR INSERT WITH CHECK (auth.uid() = responder_id);

CREATE POLICY "Users can manage their patterns" ON user_mood_patterns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their suggestion history" ON suggestion_history FOR ALL USING (auth.uid() = user_id);
