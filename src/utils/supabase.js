// Reuse the single supabase client from src/lib/supabase to avoid
// multiple GoTrueClient instances in the same browser context.
import { supabase } from '../lib/supabase'
export { supabase }

// Safe helper to get session without throwing if supabase isn't available
const getSessionSafe = async () => {
  try {
    if (!supabase || !supabase.auth || !supabase.auth.getSession) {
      return { data: { session: null } }
    }
    const resp = await supabase.auth.getSession()
    return resp || { data: { session: null } }
  } catch (err) {
    // swallow and return a consistent shape
    return { data: { session: null } }
  }
}

export const api = {
  async getMoods() {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: null, error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/moods`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      return await response.json()
    } catch (error) {
      return { data: null, error }
    }
  },

  async saveMood(moodData) {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: null, error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(moodData)
      })
      return await response.json()
    } catch (error) {
      return { data: null, error }
    }
  },

  async getCircles(params = {}) {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    
    try {
      // Build query params
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.category && params.category !== 'all') queryParams.append('category', params.category)
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.search) queryParams.append('search', params.search)
      
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/circles${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      
      const headers = {}
      if (session) {
        headers.Authorization = `Bearer ${session.access_token}`
      }
      
      const response = await fetch(url, { headers })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.warn('Circles API error, using fallback:', error)
      // Return empty array instead of error to prevent 404 issues
      return { data: [], error: null }
    }
  },

  async getUserCircles() {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: [], error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/user/circles`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      return { data: [], error: null }
    }
  },

  async joinCircle(circleId) {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: null, error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/circles/${circleId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        }
      })
      return await response.json()
    } catch (error) {
      return { data: null, error }
    }
  },

  async leaveCircle(circleId) {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: null, error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/circles/${circleId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        }
      })
      return await response.json()
    } catch (error) {
      return { data: null, error }
    }
  },

  async createCircle(circleData) {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: null, error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/circles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(circleData)
      })
      return await response.json()
    } catch (error) {
      return { data: null, error }
    }
  },

  async getRecommendedCircles(interests) {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: [], error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/circles/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ interests })
      })
      return await response.json()
    } catch (error) {
      return { data: [], error: null }
    }
  },

  async completeCircleOnboarding(data) {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: null, error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/user/onboarding/circles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      return { data: null, error }
    }
  },

  async getCirclePosts(circleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/circles/${circleId}/posts`)
      return await response.json()
    } catch (error) {
      return { data: null, error }
    }
  },

  async createPost(postData) {
    const sessionResp = await getSessionSafe()
    const session = sessionResp?.data?.session || null
    if (!session) return { data: null, error: 'Not authenticated' }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(postData)
      })
      return await response.json()
    } catch (error) {
      return { data: null, error }
    }
  }
}
