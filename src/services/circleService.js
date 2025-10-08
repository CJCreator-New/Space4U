import { supabase } from '../lib/supabase'

export const circleService = {
  async getCircles() {
    const { data, error } = await supabase
      .from('circles')
      .select('*, circle_members(count)')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async joinCircle(userId, circleId) {
    const { data, error } = await supabase
      .from('circle_members')
      .insert({ user_id: userId, circle_id: circleId })
      .select()
    return { data, error }
  },

  async leaveCircle(userId, circleId) {
    const { error } = await supabase
      .from('circle_members')
      .delete()
      .eq('user_id', userId)
      .eq('circle_id', circleId)
    return { error }
  },

  async getUserCircles(userId) {
    const { data, error } = await supabase
      .from('circle_members')
      .select('circle_id, circles(*)')
      .eq('user_id', userId)
    return { data, error }
  },

  async createPost(userId, circleId, content, isAnonymous = false) {
    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: userId, circle_id: circleId, content, is_anonymous: isAnonymous })
      .select()
    return { data, error }
  },

  async createComment(userId, postId, content, isAnonymous = false) {
    const { data, error } = await supabase
      .from('comments')
      .insert({ user_id: userId, post_id: postId, content, is_anonymous: isAnonymous })
      .select()
    return { data, error }
  }
}
