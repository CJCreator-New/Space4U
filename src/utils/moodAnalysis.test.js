import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  calculateAverageMood,
  detectWeekdayPatterns,
  calculateTrend,
  findBestAndWorstDays,
  calculateConsistencyScore,
  calculateStreak,
  detectMoodTriggers,
  generateInsights,
  generateSuggestions,
  getMoodBreakdown
} from './moodAnalysis'

describe('moodAnalysis', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('calculateAverageMood', () => {
    it('should return 0 for empty array', () => {
      expect(calculateAverageMood([])).toBe(0)
    })

    it('should calculate average correctly', () => {
      const moods = [
        { mood: 4, date: '2025-01-01' },
        { mood: 3, date: '2025-01-02' },
        { mood: 5, date: '2025-01-03' }
      ]
      expect(calculateAverageMood(moods)).toBe(4)
    })

    it('should handle single mood entry', () => {
      const moods = [{ mood: 3, date: '2025-01-01' }]
      expect(calculateAverageMood(moods)).toBe(3)
    })
  })

  describe('detectWeekdayPatterns', () => {
    it('should detect patterns by weekday', () => {
      const moods = [
        { mood: 4, date: '2025-01-06' }, // Monday
        { mood: 3, date: '2025-01-07' }, // Tuesday
        { mood: 5, date: '2025-01-13' }  // Monday
      ]
      const patterns = detectWeekdayPatterns(moods)
      expect(patterns.Monday.average).toBe(4.5)
      expect(patterns.Monday.count).toBe(2)
      expect(patterns.Tuesday.average).toBe(3)
    })

    it('should handle empty moods array', () => {
      const patterns = detectWeekdayPatterns([])
      expect(patterns).toEqual({})
    })
  })

  describe('calculateTrend', () => {
    it('should calculate positive trend', () => {
      const current = [{ mood: 4 }, { mood: 5 }]
      const previous = [{ mood: 2 }, { mood: 3 }]
      expect(calculateTrend(current, previous)).toBe(2)
    })

    it('should calculate negative trend', () => {
      const current = [{ mood: 2 }, { mood: 3 }]
      const previous = [{ mood: 4 }, { mood: 5 }]
      expect(calculateTrend(current, previous)).toBe(-2)
    })

    it('should return 0 for no change', () => {
      const current = [{ mood: 3 }]
      const previous = [{ mood: 3 }]
      expect(calculateTrend(current, previous)).toBe(0)
    })
  })

  describe('findBestAndWorstDays', () => {
    it('should find best and worst days', () => {
      const moods = [
        { mood: 3, date: '2025-01-01' },
        { mood: 5, date: '2025-01-02' },
        { mood: 1, date: '2025-01-03' }
      ]
      const result = findBestAndWorstDays(moods)
      expect(result.best.mood).toBe(5)
      expect(result.worst.mood).toBe(1)
    })

    it('should return null for empty array', () => {
      const result = findBestAndWorstDays([])
      expect(result).toEqual({ best: null, worst: null })
    })

    it('should handle single mood', () => {
      const moods = [{ mood: 3, date: '2025-01-01' }]
      const result = findBestAndWorstDays(moods)
      expect(result.best.mood).toBe(3)
      expect(result.worst.mood).toBe(3)
    })
  })

  describe('calculateConsistencyScore', () => {
    it('should calculate consistency percentage', () => {
      expect(calculateConsistencyScore([1, 2, 3], 10)).toBe(30)
    })

    it('should return 100 for perfect consistency', () => {
      expect(calculateConsistencyScore([1, 2, 3, 4, 5], 5)).toBe(100)
    })

    it('should return 0 for no entries', () => {
      expect(calculateConsistencyScore([], 10)).toBe(0)
    })
  })

  describe('calculateStreak', () => {
    it('should calculate current and longest streak', () => {
      const moods = [
        { date: '2025-01-05' },
        { date: '2025-01-06' },
        { date: '2025-01-07' }
      ]
      const result = calculateStreak(moods)
      expect(result.current).toBeGreaterThanOrEqual(0)
      expect(result.longest).toBe(3)
    })

    it('should return 0 for empty array', () => {
      const result = calculateStreak([])
      expect(result).toEqual({ current: 0, longest: 0 })
    })

    it('should handle non-consecutive dates', () => {
      const moods = [
        { date: '2025-01-01' },
        { date: '2025-01-03' },
        { date: '2025-01-05' }
      ]
      const result = calculateStreak(moods)
      expect(result.longest).toBe(1)
    })
  })

  describe('detectMoodTriggers', () => {
    it('should detect negative patterns', () => {
      const moods = [
        { mood: 2, date: '2025-01-06' }, // Monday
        { mood: 2, date: '2025-01-13' }, // Monday
        { mood: 4, date: '2025-01-07' }  // Tuesday
      ]
      const triggers = detectMoodTriggers(moods)
      expect(triggers).toHaveProperty('negative')
      expect(triggers).toHaveProperty('positive')
    })

    it('should detect positive patterns', () => {
      const moods = [
        { mood: 5, date: '2025-01-06' }, // Monday
        { mood: 5, date: '2025-01-13' }, // Monday
        { mood: 3, date: '2025-01-07' }  // Tuesday
      ]
      const triggers = detectMoodTriggers(moods)
      expect(triggers.positive.length).toBeGreaterThan(0)
    })
  })

  describe('generateInsights', () => {
    it('should return empty array for insufficient data', () => {
      const moods = [{ mood: 3, date: '2025-01-01' }]
      const insights = generateInsights(moods)
      expect(insights).toEqual([])
    })

    it('should generate positive insight for great week', () => {
      const moods = [
        { mood: 4, date: '2025-01-01' },
        { mood: 5, date: '2025-01-02' },
        { mood: 4, date: '2025-01-03' }
      ]
      const insights = generateInsights(moods)
      expect(insights.length).toBeGreaterThan(0)
      expect(insights[0].type).toBe('positive')
    })

    it('should generate support insight for tough week', () => {
      const moods = [
        { mood: 2, date: '2025-01-01' },
        { mood: 2, date: '2025-01-02' },
        { mood: 2, date: '2025-01-03' }
      ]
      const insights = generateInsights(moods)
      expect(insights.some(i => i.type === 'support')).toBe(true)
    })

    it('should limit insights to 4', () => {
      const moods = Array.from({ length: 30 }, (_, i) => ({
        mood: 4,
        date: `2025-01-${String(i + 1).padStart(2, '0')}`
      }))
      const insights = generateInsights(moods)
      expect(insights.length).toBeLessThanOrEqual(4)
    })
  })

  describe('generateSuggestions', () => {
    beforeEach(() => {
      localStorage.setItem('safespace_circles', JSON.stringify([]))
    })

    it('should generate suggestions based on mood', () => {
      const moods = [
        { mood: 3, date: '2025-01-01' },
        { mood: 3, date: '2025-01-02' }
      ]
      const suggestions = generateSuggestions(moods, {})
      expect(suggestions.length).toBeGreaterThan(0)
    })

    it('should suggest breathing exercise for low mood', () => {
      const moods = [
        { mood: 2, date: '2025-01-01' },
        { mood: 3, date: '2025-01-02' }
      ]
      const suggestions = generateSuggestions(moods, {})
      expect(suggestions.some(s => s.type === 'wellness')).toBe(true)
    })

    it('should limit suggestions to 4', () => {
      const moods = [{ mood: 3, date: '2025-01-01' }]
      const suggestions = generateSuggestions(moods, { interests: ['anxiety', 'depression'] })
      expect(suggestions.length).toBeLessThanOrEqual(4)
    })
  })

  describe('getMoodBreakdown', () => {
    it('should count moods by rating', () => {
      const moods = [
        { mood: 5 },
        { mood: 4 },
        { mood: 5 },
        { mood: 3 }
      ]
      const breakdown = getMoodBreakdown(moods)
      expect(breakdown[5]).toBe(2)
      expect(breakdown[4]).toBe(1)
      expect(breakdown[3]).toBe(1)
      expect(breakdown[2]).toBe(0)
      expect(breakdown[1]).toBe(0)
    })

    it('should return zero counts for empty array', () => {
      const breakdown = getMoodBreakdown([])
      expect(breakdown).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
    })
  })
})
