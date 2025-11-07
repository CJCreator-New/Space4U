const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Get circles with pagination and filters
app.get('/api/circles', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, sort = 'recommended', search } = req.query
    
    let query = supabase
      .from('circles')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
    
    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    // Search
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    // Sort
    switch (sort) {
      case 'members':
        query = query.order('members', { ascending: false })
        break
      case 'active':
        query = query.order('posts', { ascending: false })
        break
      case 'growth':
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('members', { ascending: false })
    }
    
    // Pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        hasMore: offset + limit < count
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user's joined circles
app.get('/api/user/circles', async (req, res) => {
  try {
    const userId = req.user?.id // From auth middleware
    
    const { data, error } = await supabase
      .from('circle_members')
      .select('circle_id, circles(*)')
      .eq('user_id', userId)
    
    if (error) throw error
    
    res.json({ data: data.map(m => m.circles) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Join circle
app.post('/api/circles/:id/join', async (req, res) => {
  try {
    const userId = req.user?.id
    const circleId = req.params.id
    
    const { error } = await supabase
      .from('circle_members')
      .insert({ circle_id: circleId, user_id: userId })
    
    if (error) throw error
    
    // Increment member count
    await supabase.rpc('increment_circle_members', { circle_id: circleId })
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create circle
app.post('/api/circles', async (req, res) => {
  try {
    const userId = req.user?.id
    const { name, description, category, visibility, icon } = req.body
    
    const { data, error } = await supabase
      .from('circles')
      .insert({
        name,
        description,
        category,
        visibility,
        icon,
        created_by: userId,
        status: 'pending_approval'
      })
      .select()
      .single()
    
    if (error) throw error
    
    res.json({ success: true, circle: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})
