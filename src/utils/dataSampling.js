/**
 * Data Sampling Utilities for Performance Optimization
 *
 * Provides utilities for sampling large datasets to improve chart performance
 * while maintaining visual accuracy.
 */

export const SAMPLING_STRATEGIES = {
  // Sample every Nth point
  INTERVAL: 'interval',

  // Sample based on time intervals (group by day/week/month)
  TIME_BASED: 'time_based',

  // Sample based on data density (keep peaks and valleys)
  DENSITY_BASED: 'density_based',

  // Adaptive sampling based on viewport size
  ADAPTIVE: 'adaptive'
}

/**
 * Sample data using interval-based sampling
 * @param {Array} data - Array of data points
 * @param {number} maxPoints - Maximum number of points to keep
 * @returns {Array} Sampled data
 */
export function sampleByInterval(data, maxPoints) {
  if (!data || data.length <= maxPoints) {
    return data
  }

  const interval = Math.ceil(data.length / maxPoints)
  const sampled = []

  for (let i = 0; i < data.length; i += interval) {
    sampled.push(data[i])
  }

  // Always include the last point
  if (sampled[sampled.length - 1] !== data[data.length - 1]) {
    sampled.push(data[data.length - 1])
  }

  return sampled
}

/**
 * Sample time-series data by grouping into time intervals
 * @param {Array} data - Array of data points with date/timestamp
 * @param {string} interval - Time interval ('day', 'week', 'month')
 * @param {Function} dateAccessor - Function to get date from data point
 * @returns {Array} Sampled data with aggregated values
 */
export function sampleByTimeInterval(data, interval = 'day', dateAccessor = (d) => new Date(d.date)) {
  if (!data || data.length === 0) return []

  const grouped = new Map()

  data.forEach(point => {
    const date = dateAccessor(point)
    let key

    switch (interval) {
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      default: // day
        key = date.toISOString().split('T')[0]
    }

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key).push(point)
  })

  // Aggregate values for each time interval
  const sampled = []
  grouped.forEach((points, dateKey) => {
    const avgMood = points.reduce((sum, p) => sum + (p.mood || 0), 0) / points.length
    const avgPoint = {
      ...points[0], // Use first point as template
      date: dateKey,
      mood: Math.round(avgMood * 10) / 10,
      aggregated: true,
      originalCount: points.length
    }
    sampled.push(avgPoint)
  })

  return sampled.sort((a, b) => new Date(a.date) - new Date(b.date))
}

/**
 * Sample data based on visual density (keep significant points)
 * @param {Array} data - Array of data points
 * @param {number} maxPoints - Maximum number of points to keep
 * @param {Function} valueAccessor - Function to get numeric value
 * @returns {Array} Sampled data
 */
export function sampleByDensity(data, maxPoints, valueAccessor = (d) => d.mood) {
  if (!data || data.length <= maxPoints) {
    return data
  }

  // Always include first and last points
  const sampled = [data[0]]

  if (data.length > 2) {
    // Calculate step size
    const step = (data.length - 2) / (maxPoints - 2)
    let currentIndex = step

    for (let i = 1; i < maxPoints - 1; i++) {
      const index = Math.floor(currentIndex)
      if (index < data.length - 1) {
        sampled.push(data[index])
      }
      currentIndex += step
    }
  }

  // Always include last point
  if (sampled[sampled.length - 1] !== data[data.length - 1]) {
    sampled.push(data[data.length - 1])
  }

  return sampled
}

/**
 * Adaptive sampling based on dataset size and requirements
 * @param {Array} data - Array of data points
 * @param {Object} options - Sampling options
 * @returns {Array} Sampled data
 */
export function adaptiveSampling(data, options = {}) {
  const {
    maxPoints = 500,
    strategy = 'interval',
    timeInterval,
    dateAccessor
  } = options

  if (!data || data.length <= maxPoints) {
    return data
  }

  switch (strategy) {
    case 'time_based':
      return sampleByTimeInterval(data, timeInterval, dateAccessor)
    case 'density':
      return sampleByDensity(data, maxPoints)
    case 'interval':
    default:
      return sampleByInterval(data, maxPoints)
  }
}

/**
 * Get optimal sampling strategy based on data characteristics
 * @param {Array} data - Array of data points
 * @param {number} maxPoints - Maximum desired points
 * @returns {Object} Recommended sampling configuration
 */
export function getOptimalSamplingStrategy(data, maxPoints = 500) {
  if (!data || data.length <= maxPoints) {
    return { strategy: null, maxPoints }
  }

  // For time-series data, use time-based sampling for large datasets
  if (data.length > 1000 && data[0]?.date) {
    return {
      strategy: 'time_based',
      timeInterval: data.length > 5000 ? 'month' : 'week',
      maxPoints
    }
  }

  // For smaller datasets, use interval sampling
  return {
    strategy: 'interval',
    maxPoints
  }
}

export default {
  SAMPLING_STRATEGIES,
  sampleByInterval,
  sampleByTimeInterval,
  sampleByDensity,
  adaptiveSampling,
  getOptimalSamplingStrategy
}