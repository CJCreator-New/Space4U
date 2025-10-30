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

  async getCircles() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/circles`)
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
