import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No token provided' })
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid token' })
  
  req.user = user
  next()
}

app.get('/api/moods', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date', { ascending: false })
  
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/moods', authenticate, async (req, res) => {
  const { date, mood, emoji, label, note } = req.body
  
  const { data, error } = await supabase
    .from('moods')
    .insert([{ user_id: req.user.id, date, mood, emoji, label, note }])
    .select()
  
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/circles', async (req, res) => {
  const { data, error } = await supabase
    .from('circles')
    .select('*, members:circle_members(count)')
  
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.get('/api/circles/:circleId/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles(*), comments(count)')
    .eq('circle_id', req.params.circleId)
    .order('created_at', { ascending: false })
  
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/posts', authenticate, async (req, res) => {
  const { circle_id, content, is_anonymous } = req.body
  
  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id: req.user.id, circle_id, content, is_anonymous }])
    .select()
  
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// Therapeutic Tools API
app.get('/api/thought-records', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('thought_records').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/thought-records', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('thought_records').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/dbt-skills', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('dbt_skills').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/dbt-skills', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('dbt_skills').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/mindfulness-sessions', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('mindfulness_sessions').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/mindfulness-sessions', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('mindfulness_sessions').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/sleep-logs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('sleep_logs').select('*').eq('user_id', req.user.id).order('date', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/sleep-logs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('sleep_logs').upsert([{ user_id: req.user.id, ...req.body }], { onConflict: 'user_id,date' }).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/crisis-plan', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('crisis_plans').select('*').eq('user_id', req.user.id).single()
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message })
  res.json(data || null)
})

app.post('/api/crisis-plan', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('crisis_plans').upsert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/assessments', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('assessments').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/assessments', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('assessments').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// Gratitude Journal API
app.get('/api/gratitude', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('gratitude_entries').select('*').eq('user_id', req.user.id).order('date', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/gratitude', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('gratitude_entries').upsert([{ user_id: req.user.id, ...req.body }], { onConflict: 'user_id,date' }).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.delete('/api/gratitude/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('gratitude_entries').delete().eq('id', req.params.id).eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

// Habit Tracker API
app.get('/api/habits', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('habits').select('*, completions:habit_completions(*)').eq('user_id', req.user.id).eq('archived', false)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/habits', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('habits').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.patch('/api/habits/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('habits').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.post('/api/habits/:id/complete', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('habit_completions').upsert([{ habit_id: req.params.id, user_id: req.user.id, ...req.body }], { onConflict: 'habit_id,date' }).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// Emotion Tracker API
app.get('/api/emotions', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('emotion_logs').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/emotions', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('emotion_logs').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// Reminders API
app.get('/api/reminders', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('reminders').select('*').eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/reminders', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('reminders').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.patch('/api/reminders/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('reminders').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.delete('/api/reminders/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('reminders').delete().eq('id', req.params.id).eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

// Coping Skills API
app.get('/api/coping-skills', async (req, res) => {
  const { data, error } = await supabase.from('coping_skills').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.get('/api/user-coping-skills', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('user_coping_skills').select('*, skill:coping_skills(*)').eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/user-coping-skills', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('user_coping_skills').upsert([{ user_id: req.user.id, ...req.body }], { onConflict: 'user_id,coping_skill_id' }).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// Priority 2 Features API
app.get('/api/triggers', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('triggers').select('*, logs:trigger_logs(*)').eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/triggers', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('triggers').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.post('/api/trigger-logs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('trigger_logs').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/journal-prompts', async (req, res) => {
  const { data, error } = await supabase.from('journal_prompts').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.get('/api/journal-entries', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('journal_entries').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/journal-entries', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('journal_entries').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/worry-logs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('worry_logs').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/worry-logs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('worry_logs').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.patch('/api/worry-logs/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('worry_logs').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/self-compassion', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('self_compassion_logs').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/self-compassion', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('self_compassion_logs').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/therapy-sessions', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('therapy_sessions').select('*').eq('user_id', req.user.id).order('session_date', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/therapy-sessions', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('therapy_sessions').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.patch('/api/therapy-sessions/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('therapy_sessions').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/medications', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('medications').select('*, logs:medication_logs(*)').eq('user_id', req.user.id).eq('active', true)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/medications', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('medications').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.post('/api/medication-logs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('medication_logs').upsert([{ user_id: req.user.id, ...req.body }], { onConflict: 'medication_id,date,time' }).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// Priority 3: Gamification API
app.get('/api/challenges', async (req, res) => {
  const { data, error } = await supabase.from('challenges').select('*, participants:challenge_participants(count)').eq('is_active', true)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/challenges/:id/join', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('challenge_participants').insert([{ challenge_id: req.params.id, user_id: req.user.id }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.patch('/api/challenge-participants/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('challenge_participants').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/streaks', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('user_streaks').select('*').eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/streaks', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('user_streaks').upsert([{ user_id: req.user.id, ...req.body }], { onConflict: 'user_id,streak_type' }).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/quests', async (req, res) => {
  const { data, error } = await supabase.from('quests').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.get('/api/user-quests', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('user_quest_progress').select('*, quest:quests(*)').eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/user-quests', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('user_quest_progress').upsert([{ user_id: req.user.id, ...req.body }], { onConflict: 'user_id,quest_id' }).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/user-level', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('user_levels').select('*').eq('user_id', req.user.id).single()
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message })
  res.json(data || { level: 1, xp: 0, total_xp: 0, badges: [] })
})

app.post('/api/user-level', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('user_levels').upsert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/wellness-plans', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('wellness_plans').select('*, activities:plan_activities(*)').eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/wellness-plans', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('wellness_plans').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.post('/api/plan-activities', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('plan_activities').insert([req.body]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.post('/api/plan-completions', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('plan_completions').upsert([{ user_id: req.user.id, ...req.body }], { onConflict: 'activity_id,date' }).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// Priority 4: Social & Community API
app.get('/api/accountability-pairs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('accountability_pairs').select('*').or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`).eq('status', 'active')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/accountability-pairs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('accountability_pairs').insert([{ user1_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.post('/api/partner-checkins', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('partner_checkins').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/peer-matches', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('peer_matches').select('*').or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`).eq('status', 'chatting')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.get('/api/peer-messages/:matchId', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('peer_messages').select('*').eq('match_id', req.params.matchId).order('created_at', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/peer-messages', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('peer_messages').insert([{ sender_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/support-requests', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('support_requests').select('*, responses:support_responses(*)').order('created_at', { ascending: false }).limit(50)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/api/support-requests', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('support_requests').insert([{ user_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.post('/api/support-responses', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('support_responses').insert([{ responder_id: req.user.id, ...req.body }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.get('/api/mood-suggestions', authenticate, async (req, res) => {
  const mood = parseInt(req.query.mood)
  const suggestions = {
    1: [{ type: 'breathing', content: 'Try 4-7-8 breathing' }, { type: 'activity', content: 'Take a short walk' }],
    2: [{ type: 'journaling', content: 'Write about your feelings' }, { type: 'coping', content: 'Use a coping skill' }],
    3: [{ type: 'gratitude', content: 'List 3 things you\'re grateful for' }],
    4: [{ type: 'social', content: 'Connect with a friend' }],
    5: [{ type: 'celebrate', content: 'Celebrate your good mood!' }]
  }
  res.json(suggestions[mood] || [])
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
