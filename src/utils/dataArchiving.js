/**
 * Data Archiving Utilities
 * Functions to archive old data to prevent storage bloat
 */

import { storage } from '../services/storage'

/**
 * Archive old gratitude entries (older than specified days)
 */
export async function archiveOldGratitudeEntries(daysToKeep = 365) {
  try {
    const { getGratitudeEntries, saveGratitudeEntries } = await import('./storageHelpers')
    const entries = await getGratitudeEntries()

    if (entries.length === 0) return { archived: 0, kept: 0 }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const recentEntries = entries.filter(entry => new Date(entry.date) >= cutoffDate)
    const oldEntries = entries.filter(entry => new Date(entry.date) < cutoffDate)

    // Save recent entries
    await saveGratitudeEntries(recentEntries)

    // Archive old entries if any
    if (oldEntries.length > 0) {
      const archived = await storage.get('space4u_archived_gratitude') || []
      const updatedArchived = [...archived, ...oldEntries]
      await storage.set('space4u_archived_gratitude', updatedArchived)
    }

    return {
      archived: oldEntries.length,
      kept: recentEntries.length,
      total: entries.length
    }
  } catch (error) {
    console.error('Error archiving gratitude entries:', error)
    return { error: error.message }
  }
}

/**
 * Archive old emotion logs (older than specified days)
 */
export async function archiveOldEmotionLogs(daysToKeep = 365) {
  try {
    const { getEmotionLogs, saveEmotionLogs } = await import('./storageHelpers')
    const logs = await getEmotionLogs()

    if (logs.length === 0) return { archived: 0, kept: 0 }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const recentLogs = logs.filter(log => new Date(log.date) >= cutoffDate)
    const oldLogs = logs.filter(log => new Date(log.date) < cutoffDate)

    // Save recent logs
    await saveEmotionLogs(recentLogs)

    // Archive old logs if any
    if (oldLogs.length > 0) {
      const archived = await storage.get('space4u_archived_emotions') || []
      const updatedArchived = [...archived, ...oldLogs]
      await storage.set('space4u_archived_emotions', updatedArchived)
    }

    return {
      archived: oldLogs.length,
      kept: recentLogs.length,
      total: logs.length
    }
  } catch (error) {
    console.error('Error archiving emotion logs:', error)
    return { error: error.message }
  }
}

/**
 * Archive old mood entries (older than specified days)
 */
export async function archiveOldMoodEntries(daysToKeep = 365) {
  try {
    const { getMoods, saveMoods } = await import('./storageHelpers')
    const moods = await getMoods()

    if (!moods || Object.keys(moods).length === 0) return { archived: 0, kept: 0 }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const recentMoods = {}
    const oldMoods = {}

    Object.entries(moods).forEach(([date, mood]) => {
      if (new Date(date) >= cutoffDate) {
        recentMoods[date] = mood
      } else {
        oldMoods[date] = mood
      }
    })

    // Save recent moods
    await saveMoods(recentMoods)

    // Archive old moods if any
    if (Object.keys(oldMoods).length > 0) {
      const archived = await storage.get('space4u_archived_moods') || {}
      const updatedArchived = { ...archived, ...oldMoods }
      await storage.set('space4u_archived_moods', updatedArchived)
    }

    return {
      archived: Object.keys(oldMoods).length,
      kept: Object.keys(recentMoods).length,
      total: Object.keys(moods).length
    }
  } catch (error) {
    console.error('Error archiving mood entries:', error)
    return { error: error.message }
  }
}

/**
 * Run comprehensive data archiving
 */
export async function runDataArchiving(options = {}) {
  const {
    daysToKeep = 365,
    archiveGratitude = true,
    archiveEmotions = true,
    archiveMoods = true
  } = options

  const results = {
    timestamp: new Date().toISOString(),
    options: { daysToKeep, archiveGratitude, archiveEmotions, archiveMoods },
    results: {}
  }

  if (archiveGratitude) {
    results.results.gratitude = await archiveOldGratitudeEntries(daysToKeep)
  }

  if (archiveEmotions) {
    results.results.emotions = await archiveOldEmotionLogs(daysToKeep)
  }

  if (archiveMoods) {
    results.results.moods = await archiveOldMoodEntries(daysToKeep)
  }

  // Store archiving history
  const history = await storage.get('space4u_archiving_history') || []
  history.push(results)
  await storage.set('space4u_archiving_history', history.slice(-10)) // Keep last 10 runs

  return results
}

/**
 * Get archived data statistics
 */
export async function getArchivedDataStats() {
  try {
    const archivedGratitude = await storage.get('space4u_archived_gratitude') || []
    const archivedEmotions = await storage.get('space4u_archived_emotions') || []
    const archivedMoods = await storage.get('space4u_archived_moods') || {}

    return {
      gratitude: archivedGratitude.length,
      emotions: archivedEmotions.length,
      moods: Object.keys(archivedMoods).length,
      total: archivedGratitude.length + archivedEmotions.length + Object.keys(archivedMoods).length
    }
  } catch (error) {
    console.error('Error getting archived data stats:', error)
    return { error: error.message }
  }
}

/**
 * Clear all archived data (permanent deletion)
 */
export async function clearArchivedData() {
  try {
    await storage.remove('space4u_archived_gratitude')
    await storage.remove('space4u_archived_emotions')
    await storage.remove('space4u_archived_moods')
    await storage.remove('space4u_archiving_history')

    return { success: true }
  } catch (error) {
    console.error('Error clearing archived data:', error)
    return { error: error.message }
  }
}