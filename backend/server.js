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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
