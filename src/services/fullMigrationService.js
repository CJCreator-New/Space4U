import { supabase } from '../lib/supabase'

export const fullMigrationService = {
  async migrateAllData(userId) {
    const results = {}
    
    try {
      // Core data
      results.moods = await this.migrateMoods(userId)
      results.profile = await this.migrateProfile(userId)
      results.badges = await this.migrateBadges(userId)
      
      // Priority 1 features
      results.gratitude = await this.migrateGratitude(userId)
      results.habits = await this.migrateHabits(userId)
      results.emotions = await this.migrateEmotions(userId)
      results.reminders = await this.migrateReminders(userId)
      
      // Priority 2 features
      results.triggers = await this.migrateTriggers(userId)
      results.medications = await this.migrateMedications(userId)
      results.therapySessions = await this.migrateTherapySessions(userId)
      
      // Priority 3 features
      results.challenges = await this.migrateChallenges(userId)
      results.streaks = await this.migrateStreaks(userId)
      
      // Settings
      results.settings = await this.migrateSettings(userId)
      
      localStorage.setItem('safespace_migration_complete', 'true')
      return results
    } catch (error) {
      console.error('Migration error:', error)
      throw error
    }
  },

  async migrateMoods(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    const entries = Object.entries(data).map(([date, mood]) => ({
      user_id: userId,
      date,
      rating: mood.rating,
      note: mood.note || null,
      tags: mood.tags || []
    }))
    if (entries.length === 0) return { count: 0 }
    await supabase.from('moods').upsert(entries, { onConflict: 'user_id,date' })
    return { count: entries.length }
  },

  async migrateProfile(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_user_profile') || '{}')
    if (!data.username) return { count: 0 }
    await supabase.from('profiles').upsert({
      id: userId,
      username: data.username,
      avatar_url: data.avatar,
      age_confirmed: data.ageConfirmed || false,
      interests: data.interests || []
    })
    return { count: 1 }
  },

  async migrateBadges(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_badges') || '{}')
    const entries = Object.entries(data)
      .filter(([_, badge]) => badge.unlocked)
      .map(([badgeId, badge]) => ({
        user_id: userId,
        badge_id: badgeId,
        unlocked_at: badge.unlockedAt || new Date().toISOString(),
        progress: badge.progress || 0
      }))
    if (entries.length === 0) return { count: 0 }
    await supabase.from('user_badges').upsert(entries, { onConflict: 'user_id,badge_id' })
    return { count: entries.length }
  },

  async migrateGratitude(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_gratitude') || '[]')
    if (data.length === 0) return { count: 0 }
    const entries = data.map(entry => ({ user_id: userId, ...entry }))
    await supabase.from('gratitude_entries').insert(entries)
    return { count: entries.length }
  },

  async migrateHabits(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_habits') || '[]')
    if (data.length === 0) return { count: 0 }
    const entries = data.map(habit => ({ user_id: userId, ...habit }))
    await supabase.from('habits').insert(entries)
    return { count: entries.length }
  },

  async migrateEmotions(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_emotions') || '[]')
    if (data.length === 0) return { count: 0 }
    const entries = data.map(emotion => ({ user_id: userId, ...emotion }))
    await supabase.from('emotion_logs').insert(entries)
    return { count: entries.length }
  },

  async migrateReminders(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_reminders') || '[]')
    if (data.length === 0) return { count: 0 }
    const entries = data.map(reminder => ({ user_id: userId, ...reminder }))
    await supabase.from('reminders').insert(entries)
    return { count: entries.length }
  },

  async migrateTriggers(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_triggers') || '[]')
    if (data.length === 0) return { count: 0 }
    const entries = data.map(trigger => ({ user_id: userId, ...trigger }))
    await supabase.from('triggers').insert(entries)
    return { count: entries.length }
  },

  async migrateMedications(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_medications') || '[]')
    if (data.length === 0) return { count: 0 }
    const entries = data.map(med => ({ user_id: userId, ...med }))
    await supabase.from('medications').insert(entries)
    return { count: entries.length }
  },

  async migrateTherapySessions(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_therapy_sessions') || '[]')
    if (data.length === 0) return { count: 0 }
    const entries = data.map(session => ({ user_id: userId, ...session }))
    await supabase.from('therapy_sessions').insert(entries)
    return { count: entries.length }
  },

  async migrateChallenges(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_challenges') || '[]')
    if (data.length === 0) return { count: 0 }
    const entries = data.map(challenge => ({ user_id: userId, ...challenge }))
    await supabase.from('user_challenges').insert(entries)
    return { count: entries.length }
  },

  async migrateStreaks(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_streaks') || '{}')
    if (Object.keys(data).length === 0) return { count: 0 }
    await supabase.from('user_streaks').upsert({ user_id: userId, ...data })
    return { count: 1 }
  },

  async migrateSettings(userId) {
    const data = JSON.parse(localStorage.getItem('safespace_settings') || '{}')
    if (Object.keys(data).length === 0) return { count: 0 }
    await supabase.from('user_settings').upsert({ user_id: userId, settings: data })
    return { count: 1 }
  },

  isMigrationComplete() {
    return localStorage.getItem('safespace_migration_complete') === 'true'
  }
}
