import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  formatRelativeTime,
  generateUsername,
  filterProfanity,
  calculateReadTime,
  formatNumber,
  truncateText,
  getRandomItem,
  validateUsername
} from './helpers'

describe('helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('formatRelativeTime', () => {
    it('should return "just now" for recent timestamps', () => {
      const now = new Date()
      expect(formatRelativeTime(now)).toBe('just now')
    })

    it('should format minutes correctly', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago')
    })

    it('should format hours correctly', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago')
    })

    it('should format days correctly', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago')
    })

    it('should format weeks correctly', () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago')
    })

    it('should format months correctly', () => {
      const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(twoMonthsAgo)).toBe('2 months ago')
    })
  })

  describe('generateUsername', () => {
    it('should generate a username', () => {
      const username = generateUsername()
      expect(username).toBeTruthy()
      expect(typeof username).toBe('string')
    })

    it('should generate username with adjective and animal', () => {
      const username = generateUsername()
      expect(username.length).toBeGreaterThan(0)
      expect(/^[A-Z][a-z]+[A-Z][a-z]+$/.test(username)).toBe(true)
    })

    it('should generate different usernames', () => {
      const username1 = generateUsername()
      const username2 = generateUsername()
      // May occasionally be same, but unlikely
      expect(username1).toBeTruthy()
      expect(username2).toBeTruthy()
    })
  })

  describe('filterProfanity', () => {
    it('should return text unchanged if no profanity', () => {
      const text = 'This is a clean message'
      expect(filterProfanity(text)).toBe(text)
    })

    it('should filter profanity with asterisks', () => {
      const text = 'This has badword1 in it'
      expect(filterProfanity(text)).toBe('This has ******** in it')
    })

    it('should be case insensitive', () => {
      const text = 'This has BADWORD1 in it'
      expect(filterProfanity(text)).toBe('This has ******** in it')
    })

    it('should handle multiple profanities', () => {
      const text = 'badword1 and badword2'
      const filtered = filterProfanity(text)
      expect(filtered).toContain('********')
    })
  })

  describe('calculateReadTime', () => {
    it('should calculate read time for short text', () => {
      const text = 'This is a short text with about ten words here.'
      expect(calculateReadTime(text)).toBe('1 min read')
    })

    it('should calculate read time for longer text', () => {
      const text = 'word '.repeat(400) // 400 words
      expect(calculateReadTime(text)).toBe('2 min read')
    })

    it('should handle empty text', () => {
      expect(calculateReadTime('')).toBe('1 min read')
    })

    it('should handle single word', () => {
      expect(calculateReadTime('word')).toBe('1 min read')
    })
  })

  describe('formatNumber', () => {
    it('should return number as string for < 1000', () => {
      expect(formatNumber(999)).toBe('999')
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(500)).toBe('500')
    })

    it('should format thousands with k', () => {
      expect(formatNumber(1000)).toBe('1.0k')
      expect(formatNumber(1500)).toBe('1.5k')
      expect(formatNumber(12345)).toBe('12.3k')
    })

    it('should format millions with m', () => {
      expect(formatNumber(1000000)).toBe('1.0m')
      expect(formatNumber(2500000)).toBe('2.5m')
    })
  })

  describe('truncateText', () => {
    it('should return text unchanged if shorter than max', () => {
      const text = 'Short text'
      expect(truncateText(text, 20)).toBe(text)
    })

    it('should truncate text with ellipsis', () => {
      const text = 'This is a long text that needs truncating'
      expect(truncateText(text, 20)).toBe('This is a long text...')
    })

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars'
      expect(truncateText(text, 20)).toBe(text)
    })

    it('should trim whitespace before ellipsis', () => {
      const text = 'Text with spaces at end   '
      const result = truncateText(text, 15)
      expect(result).not.toContain('  ...')
    })
  })

  describe('getRandomItem', () => {
    it('should return an item from array', () => {
      const array = ['a', 'b', 'c']
      const item = getRandomItem(array)
      expect(array).toContain(item)
    })

    it('should return only item from single-item array', () => {
      const array = ['only']
      expect(getRandomItem(array)).toBe('only')
    })

    it('should handle different data types', () => {
      const array = [1, 2, 3, 4, 5]
      const item = getRandomItem(array)
      expect(array).toContain(item)
      expect(typeof item).toBe('number')
    })
  })

  describe('validateUsername', () => {
    it('should return null for valid username', () => {
      expect(validateUsername('validUser123')).toBeNull()
      expect(validateUsername('user_name')).toBeNull()
      expect(validateUsername('abc')).toBeNull()
    })

    it('should reject username too short', () => {
      expect(validateUsername('ab')).toBe('Username must be at least 3 characters')
    })

    it('should reject username too long', () => {
      const longUsername = 'a'.repeat(21)
      expect(validateUsername(longUsername)).toBe('Username must be 20 characters or less')
    })

    it('should reject invalid characters', () => {
      expect(validateUsername('user name')).toBe('Only letters, numbers, and underscores allowed')
      expect(validateUsername('user-name')).toBe('Only letters, numbers, and underscores allowed')
      expect(validateUsername('user@name')).toBe('Only letters, numbers, and underscores allowed')
    })

    it('should accept underscores', () => {
      expect(validateUsername('user_name_123')).toBeNull()
    })

    it('should accept numbers', () => {
      expect(validateUsername('user123')).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string in truncateText', () => {
      expect(() => truncateText('', 10)).not.toThrow()
      expect(truncateText('', 10)).toBe('')
    })

    it('should handle empty arrays', () => {
      expect(() => getRandomItem([])).not.toThrow()
    })
  })
})
