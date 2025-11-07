import { subDays, subMonths, subYears, startOfDay, endOfDay, isWithinInterval } from 'date-fns'

/**
 * Date Range Utilities for Mood Data Filtering
 */

export const DATE_RANGES = {
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 90 days', days: 90 },
  '6m': { label: 'Last 6 months', months: 6 },
  '1y': { label: 'Last year', years: 1 },
  'all': { label: 'All time', all: true }
}

export const DEFAULT_DATE_RANGE = '30d'

/**
 * Get date range boundaries
 * @param {string} range - Date range key (7d, 30d, 90d, 6m, 1y, all)
 * @param {Date} referenceDate - Reference date (default: now)
 * @returns {Object} { startDate, endDate, range }
 */
export function getDateRange(range, referenceDate = new Date()) {
  if (range === 'all') {
    return {
      startDate: null,
      endDate: null,
      range: 'all'
    }
  }

  const config = DATE_RANGES[range]
  if (!config) {
    throw new Error(`Invalid date range: ${range}`)
  }

  let startDate

  if (config.days) {
    startDate = startOfDay(subDays(referenceDate, config.days))
  } else if (config.months) {
    startDate = startOfDay(subMonths(referenceDate, config.months))
  } else if (config.years) {
    startDate = startOfDay(subYears(referenceDate, config.years))
  }

  const endDate = endOfDay(referenceDate)

  return {
    startDate,
    endDate,
    range
  }
}

/**
 * Filter mood data by date range
 * @param {Object} moods - Mood data object (date -> mood)
 * @param {string} range - Date range key
 * @param {Date} referenceDate - Reference date
 * @returns {Object} Filtered mood data
 */
export function filterMoodsByDateRange(moods, range, referenceDate = new Date()) {
  if (range === 'all' || !moods) {
    return moods
  }

  const { startDate, endDate } = getDateRange(range, referenceDate)
  const filtered = {}

  Object.entries(moods).forEach(([dateStr, mood]) => {
    const date = new Date(dateStr)
    if (isWithinInterval(date, { start: startDate, end: endDate })) {
      filtered[dateStr] = mood
    }
  })

  return filtered
}

/**
 * Get mood statistics for a date range
 * @param {Object} moods - Mood data object
 * @param {string} range - Date range key
 * @returns {Object} Statistics
 */
export function getMoodStatsForRange(moods, range) {
  const filteredMoods = filterMoodsByDateRange(moods, range)
  const entries = Object.values(filteredMoods)

  if (entries.length === 0) {
    return {
      count: 0,
      average: 0,
      range
    }
  }

  const average = entries.reduce((sum, mood) => sum + (mood.mood || 0), 0) / entries.length

  return {
    count: entries.length,
    average: Math.round(average * 10) / 10,
    range
  }
}

/**
 * Check if a date range has data
 * @param {Object} moods - Mood data object
 * @param {string} range - Date range key
 * @returns {boolean} True if range has data
 */
export function hasDataForRange(moods, range) {
  if (range === 'all') {
    return Object.keys(moods || {}).length > 0
  }

  const filtered = filterMoodsByDateRange(moods, range)
  return Object.keys(filtered).length > 0
}

export default {
  DATE_RANGES,
  DEFAULT_DATE_RANGE,
  getDateRange,
  filterMoodsByDateRange,
  getMoodStatsForRange,
  hasDataForRange
}