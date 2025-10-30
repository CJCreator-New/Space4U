// Reuse the single supabase client from src/lib/supabase to avoid
// multiple GoTrueClient instances in the same browser context.
import { supabase } from '../lib/supabase'
export { supabase }

export const api = {
  async getMoods() {
  const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
    if (!session) return { data: null, error: 'Not authenticated' }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/moods`, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    })
    return response.json()
  },

  async saveMood(moodData) {
  const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
    if (!session) return { data: null, error: 'Not authenticated' }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/moods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(moodData)
    })
    return response.json()
  },

  async getCircles() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/circles`)
    return response.json()
  },

  async getCirclePosts(circleId) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/circles/${circleId}/posts`)
    return response.json()
  },

  async createPost(postData) {
  const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
  if (!session) return { data: null, error: 'Not authenticated' }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(postData)
    })
    return response.json()
  }
}
