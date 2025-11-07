import { storage } from '../services/storage'

/**
 * Storage Helper Functions
 * Simplified wrappers for common storage operations
 */

/**
 * Get gratitude entries
 */
export async function getGratitudeEntries() {
  const entries = await storage.get('space4u_gratitude_entries')
  return entries || []
}

/**
 * Save gratitude entries
 */
export async function saveGratitudeEntries(entries) {
  await storage.set('space4u_gratitude_entries', entries)
}

/**
 * Get habits
 */
export async function getHabits() {
  const habits = await storage.get('space4u_habits')
  return habits || []
}

/**
 * Save habits
 */
export async function saveHabits(habits) {
  await storage.set('space4u_habits', habits)
}

/**
 * Get reminders
 */
export async function getReminders() {
  const reminders = await storage.get('space4u_reminders')
  return reminders || []
}

/**
 * Save reminders
 */
export async function saveReminders(reminders) {
  await storage.set('space4u_reminders', reminders)
}

/**
 * Get user profile
 */
export async function getUserProfile() {
  const profile = await storage.get('space4u_user_profile')
  return profile || null
}

/**
 * Save user profile
 */
export async function saveUserProfile(profile) {
  await storage.set('space4u_user_profile', profile)
}

/**
 * Get settings
 */
export async function getSettings() {
  const settings = await storage.get('space4u_settings')
  return settings || {}
}

/**
 * Save settings
 */
export async function saveSettings(settings) {
  await storage.set('space4u_settings', settings)
}

/**
 * Get emotion logs
 */
export async function getEmotionLogs() {
  const logs = await storage.get('space4u_emotion_logs')
  return logs || []
}

/**
 * Save emotion logs
 */
export async function saveEmotionLogs(logs) {
  await storage.set('space4u_emotion_logs', logs)
}

/**
 * Get badges
 */
export async function getBadges() {
  const badges = await storage.get('space4u_badges')
  return badges || null
}

/**
 * Save badges
 */
export async function saveBadges(badges) {
  await storage.set('space4u_badges', badges)
}
