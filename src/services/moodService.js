import { supabase } from '../lib/supabase'

export const moodService = {
  async getMoods(userId) {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    return { data, error }
  },

  async createMood(userId, moodData) {
    const { data, error } = await supabase
      .from('moods')
      .insert([{ user_id: userId, ...moodData }])
      .select()
    return { data, error }
  },

  async updateMood(moodId, moodData) {
    const { data, error } = await supabase
      .from('moods')
      .update(moodData)
      .eq('id', moodId)
      .select()
    return { data, error }
  },

  async deleteMood(moodId) {
    const { error } = await supabase
      .from('moods')
      .delete()
      .eq('id', moodId)
    return { error }
  }
}
