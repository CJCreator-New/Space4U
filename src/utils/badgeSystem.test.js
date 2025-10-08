import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  BADGES,
  LEVELS,
  POINT_VALUES,
  initializeBadgeSystem,
  calculateUserLevel,
  getProgressToNextLevel,
  checkBadgeProgress,
  addPoints,
  checkMoodLogBadges,
  checkCommunityBadges
} from './badgeSystem'

describe('badgeSystem', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('BADGES constant', () => {
    it('should have all required badge properties', () => {
      Object.values(BADGES).forEach(badge => {
        expect(badge).toHaveProperty('id')
        expect(badge).toHaveProperty('name')
        expect(badge).toHaveProperty('description')
        expect(badge).toHaveProperty('emoji')
        expect(badge).toHaveProperty('category')
        expect(badge).toHaveProperty('points')
        expect(badge).toHaveProperty('requirement')
        expect(badge).toHaveProperty('rarity')
      })
    })

    it('should have consistency badges', () => {
      expect(BADGES['first-steps']).toBeDefined()
      expect(BADGES['week-warrior']).toBeDefined()
      expect(BADGES['month-master']).toBeDefined()
    })

    it('should have community badges', () => {
      expect(BADGES['conversation-starter']).toBeDefined()
      expect(BADGES['circle-builder']).toBeDefined()
    })

    it('should have wellness badges', () => {
      expect(BADGES['mindful-moment']).toBeDefined()
      expect(BADGES['positive-vibes']).toBeDefined()
    })
  })

  describe('initializeBadgeSystem', () => {
    it('should create initial badge data if none exists', () => {
      const data = initializeBadgeSystem()
      expect(data).toHaveProperty('badges')
      expect(data).toHaveProperty('totalPoints')
      expect(data).toHaveProperty('level')
      expect(data.totalPoints).toBe(0)
      expect(data.level).toBe('beginner')
    })

    it('should return existing data if already initialized', () => {
      const existing = { badges: [], totalPoints: 50, level: 'regular' }
      localStorage.setItem('safespace_badges', JSON.stringify(existing))
      const data = initializeBadgeSystem()
      expect(data.totalPoints).toBe(50)
      expect(data.level).toBe('regular')
    })

    it('should initialize all badges as unlocked false', () => {
      const data = initializeBadgeSystem()
      data.badges.forEach(badge => {
        expect(badge.unlocked).toBe(false)
        expect(badge.progress).toBe(0)
      })
    })
  })

  describe('calculateUserLevel', () => {
    it('should return beginner for 0-50 points', () => {
      expect(calculateUserLevel(0)).toBe('beginner')
      expect(calculateUserLevel(25)).toBe('beginner')
      expect(calculateUserLevel(50)).toBe('beginner')
    })

    it('should return regular for 51-150 points', () => {
      expect(calculateUserLevel(51)).toBe('regular')
      expect(calculateUserLevel(100)).toBe('regular')
      expect(calculateUserLevel(150)).toBe('regular')
    })

    it('should return champion for 151-500 points', () => {
      expect(calculateUserLevel(151)).toBe('champion')
      expect(calculateUserLevel(300)).toBe('champion')
      expect(calculateUserLevel(500)).toBe('champion')
    })

    it('should return legend for 501+ points', () => {
      expect(calculateUserLevel(501)).toBe('legend')
      expect(calculateUserLevel(1000)).toBe('legend')
    })
  })

  describe('getProgressToNextLevel', () => {
    it('should calculate progress to next level', () => {
      const result = getProgressToNextLevel(25)
      expect(result).toHaveProperty('progress')
      expect(result).toHaveProperty('pointsNeeded')
      expect(result).toHaveProperty('nextLevel')
      expect(result.nextLevel).toBe('regular')
    })

    it('should return 100% progress for max level', () => {
      const result = getProgressToNextLevel(1000)
      expect(result.progress).toBe(100)
      expect(result.pointsNeeded).toBe(0)
      expect(result.nextLevel).toBeNull()
    })

    it('should calculate points needed correctly', () => {
      const result = getProgressToNextLevel(40)
      expect(result.pointsNeeded).toBe(11) // 51 - 40
    })
  })

  describe('checkBadgeProgress', () => {
    beforeEach(() => {
      initializeBadgeSystem()
    })

    it('should update badge progress', () => {
      const result = checkBadgeProgress('first-steps', 1)
      expect(result).toBeDefined()
      expect(result.unlocked).toBe(true)
    })

    it('should unlock badge when requirement met', () => {
      const result = checkBadgeProgress('week-warrior', 7)
      expect(result.unlocked).toBe(true)
      expect(result.badge.id).toBe('week-warrior')
    })

    it('should not unlock if already unlocked', () => {
      checkBadgeProgress('first-steps', 1)
      const result = checkBadgeProgress('first-steps', 1)
      expect(result).toBeNull()
    })

    it('should add points when badge unlocked', () => {
      checkBadgeProgress('first-steps', 1)
      const data = JSON.parse(localStorage.getItem('safespace_badges'))
      expect(data.totalPoints).toBe(BADGES['first-steps'].points)
    })

    it('should update level when points increase', () => {
      checkBadgeProgress('century-club', 100)
      const data = JSON.parse(localStorage.getItem('safespace_badges'))
      expect(data.level).toBe(calculateUserLevel(data.totalPoints))
    })
  })

  describe('addPoints', () => {
    beforeEach(() => {
      initializeBadgeSystem()
    })

    it('should add points to total', () => {
      const total = addPoints(10, 'test')
      expect(total).toBe(10)
    })

    it('should update level based on new points', () => {
      addPoints(60, 'test')
      const data = JSON.parse(localStorage.getItem('safespace_badges'))
      expect(data.level).toBe('regular')
    })

    it('should accumulate points correctly', () => {
      addPoints(10, 'test1')
      const total = addPoints(15, 'test2')
      expect(total).toBe(25)
    })
  })

  describe('checkMoodLogBadges', () => {
    beforeEach(() => {
      initializeBadgeSystem()
    })

    it('should unlock first-steps on first mood', () => {
      localStorage.setItem('safespace_moods', JSON.stringify({
        '2025-01-01': { mood: 4 }
      }))
      const results = checkMoodLogBadges()
      expect(results.some(r => r.badge.id === 'first-steps' && r.unlocked)).toBe(true)
    })

    it('should track century-club progress', () => {
      const moods = {}
      for (let i = 1; i <= 50; i++) {
        moods[`2025-01-${String(i).padStart(2, '0')}`] = { mood: 4 }
      }
      localStorage.setItem('safespace_moods', JSON.stringify(moods))
      const results = checkMoodLogBadges()
      expect(results.some(r => r.badge.id === 'century-club')).toBe(true)
    })

    it('should detect 7-day streak for week-warrior', () => {
      const moods = {}
      for (let i = 1; i <= 7; i++) {
        moods[`2025-01-${String(i).padStart(2, '0')}`] = { mood: 4 }
      }
      localStorage.setItem('safespace_moods', JSON.stringify(moods))
      const results = checkMoodLogBadges()
      expect(results.some(r => r.badge.id === 'week-warrior')).toBe(true)
    })

    it('should detect positive-vibes for 7 happy moods', () => {
      const moods = {}
      for (let i = 1; i <= 7; i++) {
        moods[`2025-01-${String(i).padStart(2, '0')}`] = { mood: 5 }
      }
      localStorage.setItem('safespace_moods', JSON.stringify(moods))
      const results = checkMoodLogBadges()
      expect(results.some(r => r.badge.id === 'positive-vibes')).toBe(true)
    })

    it('should return empty array for no moods', () => {
      localStorage.setItem('safespace_moods', JSON.stringify({}))
      const results = checkMoodLogBadges()
      expect(results).toEqual([])
    })
  })

  describe('checkCommunityBadges', () => {
    beforeEach(() => {
      initializeBadgeSystem()
    })

    it('should unlock conversation-starter on first post', () => {
      localStorage.setItem('safespace_user_posts', JSON.stringify([
        { id: 1, content: 'First post', circleId: 1 }
      ]))
      const results = checkCommunityBadges()
      expect(results.some(r => r.badge.id === 'conversation-starter' && r.unlocked)).toBe(true)
    })

    it('should track circle-builder progress', () => {
      localStorage.setItem('safespace_circles', JSON.stringify([1, 2, 3]))
      const results = checkCommunityBadges()
      expect(results.some(r => r.badge.id === 'circle-builder')).toBe(true)
    })

    it('should detect voice-heard for posts in different circles', () => {
      localStorage.setItem('safespace_user_posts', JSON.stringify([
        { id: 1, circleId: 1 },
        { id: 2, circleId: 2 },
        { id: 3, circleId: 3 }
      ]))
      const results = checkCommunityBadges()
      expect(results.some(r => r.badge.id === 'voice-heard')).toBe(true)
    })

    it('should return empty array for no activity', () => {
      localStorage.setItem('safespace_user_posts', JSON.stringify([]))
      localStorage.setItem('safespace_circles', JSON.stringify([]))
      const results = checkCommunityBadges()
      expect(results).toEqual([])
    })
  })

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('safespace_badges', 'invalid json')
      expect(() => initializeBadgeSystem()).toThrow()
    })

    it('should handle missing localStorage keys', () => {
      initializeBadgeSystem()
      localStorage.removeItem('safespace_moods')
      const results = checkMoodLogBadges()
      expect(results).toEqual([])
    })

    it('should cap progress at requirement', () => {
      initializeBadgeSystem()
      const result = checkBadgeProgress('first-steps', 100)
      const data = JSON.parse(localStorage.getItem('safespace_badges'))
      const badge = data.badges.find(b => b.id === 'first-steps')
      expect(badge.progress).toBe(1) // requirement is 1
    })
  })
})
