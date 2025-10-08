import { supabase } from '../lib/supabase'

export const migrationService = {
  async migrateMoods(userId) {
    const localMoods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    const entries = Object.entries(localMoods)
    
    if (entries.length === 0) return { success: true, count: 0 }

    const moodsToInsert = entries.map(([date, mood]) => ({
      user_id: userId,
      date,
      rating: mood.rating,
      note: mood.note || null,
      tags: mood.tags || []
    }))

    const { error } = await supabase.from('moods').upsert(moodsToInsert, {
      onConflict: 'user_id,date'
    })

    if (error) throw error
    return { success: true, count: entries.length }
  },

  async migrateProfile(userId) {
    const profile = JSON.parse(localStorage.getItem('safespace_user_profile') || '{}')
    
    if (!profile.username) return { success: true }

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      username: profile.username,
      avatar_url: profile.avatar,
      age_confirmed: profile.ageConfirmed || false,
      interests: profile.interests || []
    })

    if (error) throw error
    return { success: true }
  },

  async migrateBadges(userId) {
    const badges = JSON.parse(localStorage.getItem('safespace_badges') || '{}')
    const unlockedBadges = Object.entries(badges)
      .filter(([_, badge]) => badge.unlocked)
      .map(([badgeId, badge]) => ({
        user_id: userId,
        badge_id: badgeId,
        unlocked_at: badge.unlockedAt || new Date().toISOString(),
        progress: badge.progress || 0
      }))

    if (unlockedBadges.length === 0) return { success: true, count: 0 }

    const { error } = await supabase.from('user_badges').upsert(unlockedBadges, {
      onConflict: 'user_id,badge_id'
    })

    if (error) throw error
    return { success: true, count: unlockedBadges.length }
  },

  async migrateAll(userId) {
    const results = {
      moods: await this.migrateMoods(userId),
      profile: await this.migrateProfile(userId),
      badges: await this.migrateBadges(userId)
    }

    localStorage.setItem('safespace_migration_complete', 'true')
    return results
  },

  isMigrationComplete() {
    return localStorage.getItem('safespace_migration_complete') === 'true'
  }
}
