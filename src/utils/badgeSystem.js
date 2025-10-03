// Badge definitions and achievement system

export const BADGES = {
  // Consistency Badges
  'first-steps': {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Log your first mood',
    emoji: '🌱',
    category: 'consistency',
    points: 10,
    requirement: 1,
    rarity: 'common'
  },
  'week-warrior': {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: '7-day logging streak',
    emoji: '🔥',
    category: 'consistency',
    points: 25,
    requirement: 7,
    rarity: 'uncommon'
  },
  'month-master': {
    id: 'month-master',
    name: 'Month Master',
    description: '30-day logging streak',
    emoji: '⭐',
    category: 'consistency',
    points: 100,
    requirement: 30,
    rarity: 'rare'
  },
  'century-club': {
    id: 'century-club',
    name: 'Century Club',
    description: '100 total mood logs',
    emoji: '🏆',
    category: 'consistency',
    points: 150,
    requirement: 100,
    rarity: 'epic'
  },
  'consistent-champion': {
    id: 'consistent-champion',
    name: 'Consistent Champion',
    description: 'Never missed a day for 30 days',
    emoji: '💎',
    category: 'consistency',
    points: 200,
    requirement: 30,
    rarity: 'legendary'
  },

  // Community Badges
  'conversation-starter': {
    id: 'conversation-starter',
    name: 'Conversation Starter',
    description: 'Make your first post',
    emoji: '💬',
    category: 'community',
    points: 15,
    requirement: 1,
    rarity: 'common'
  },
  'voice-heard': {
    id: 'voice-heard',
    name: 'Voice Heard',
    description: 'Post in 3 different circles',
    emoji: '🎤',
    category: 'community',
    points: 30,
    requirement: 3,
    rarity: 'uncommon'
  },
  'supporting-soul': {
    id: 'supporting-soul',
    name: 'Supporting Soul',
    description: 'Receive 10 hearts on posts',
    emoji: '❤️',
    category: 'community',
    points: 50,
    requirement: 10,
    rarity: 'rare'
  },
  'circle-builder': {
    id: 'circle-builder',
    name: 'Circle Builder',
    description: 'Join 5 circles',
    emoji: '🤝',
    category: 'community',
    points: 40,
    requirement: 5,
    rarity: 'uncommon'
  },
  'community-hero': {
    id: 'community-hero',
    name: 'Community Hero',
    description: '50 helpful comments',
    emoji: '🌟',
    category: 'community',
    points: 75,
    requirement: 50,
    rarity: 'epic'
  },

  // Wellness Badges
  'mindful-moment': {
    id: 'mindful-moment',
    name: 'Mindful Moment',
    description: 'Complete a breathing exercise',
    emoji: '🧘',
    category: 'wellness',
    points: 20,
    requirement: 1,
    rarity: 'common'
  },
  'positive-vibes': {
    id: 'positive-vibes',
    name: 'Positive Vibes',
    description: 'Log 7 consecutive happy moods',
    emoji: '🌈',
    category: 'wellness',
    points: 60,
    requirement: 7,
    rarity: 'rare'
  },
  'resilience': {
    id: 'resilience',
    name: 'Resilience',
    description: 'Log mood on a tough day',
    emoji: '💪',
    category: 'wellness',
    points: 25,
    requirement: 1,
    rarity: 'uncommon'
  },

  // Milestone Badges
  'one-month-strong': {
    id: 'one-month-strong',
    name: 'One Month Strong',
    description: '30 days on Safespace',
    emoji: '🎂',
    category: 'milestone',
    points: 50,
    requirement: 30,
    rarity: 'uncommon'
  },
  'three-month-journey': {
    id: 'three-month-journey',
    name: 'Three Month Journey',
    description: '90 days on Safespace',
    emoji: '🎉',
    category: 'milestone',
    points: 100,
    requirement: 90,
    rarity: 'rare'
  }
}

export const LEVELS = {
  beginner: { name: 'Beginner', emoji: '🌱', min: 0, max: 50 },
  regular: { name: 'Regular', emoji: '⭐', min: 51, max: 150 },
  champion: { name: 'Champion', emoji: '🏆', min: 151, max: 500 },
  legend: { name: 'Legend', emoji: '👑', min: 501, max: Infinity }
}

export const POINT_VALUES = {
  moodLog: 1,
  post: 5,
  comment: 2,
  heartReceived: 1,
  exercise: 3,
  badgeUnlock: 10
}

export const initializeBadgeSystem = () => {
  const existing = localStorage.getItem('safespace_badges')
  if (!existing) {
    const initialData = {
      badges: Object.values(BADGES).map(badge => ({
        id: badge.id,
        name: badge.name,
        unlocked: false,
        progress: 0,
        requirement: badge.requirement,
        unlockedAt: null
      })),
      totalPoints: 0,
      level: 'beginner'
    }
    localStorage.setItem('safespace_badges', JSON.stringify(initialData))
    return initialData
  }
  return JSON.parse(existing)
}

export const calculateUserLevel = (points) => {
  for (const [key, level] of Object.entries(LEVELS)) {
    if (points >= level.min && points <= level.max) {
      return key
    }
  }
  return 'beginner'
}

export const getProgressToNextLevel = (points) => {
  const currentLevel = calculateUserLevel(points)
  const levelKeys = Object.keys(LEVELS)
  const currentIndex = levelKeys.indexOf(currentLevel)
  
  if (currentIndex === levelKeys.length - 1) {
    return { progress: 100, pointsNeeded: 0, nextLevel: null }
  }
  
  const nextLevelKey = levelKeys[currentIndex + 1]
  const nextLevel = LEVELS[nextLevelKey]
  const currentLevelMax = LEVELS[currentLevel].max
  const pointsNeeded = nextLevel.min - points
  const progress = ((points - LEVELS[currentLevel].min) / (currentLevelMax - LEVELS[currentLevel].min)) * 100
  
  return { progress, pointsNeeded, nextLevel: nextLevelKey }
}

export const checkBadgeProgress = (badgeId, currentProgress) => {
  const badgeData = JSON.parse(localStorage.getItem('safespace_badges'))
  const badge = badgeData.badges.find(b => b.id === badgeId)
  
  if (!badge || badge.unlocked) return null
  
  const wasClose = badge.progress >= badge.requirement - 1
  badge.progress = Math.min(currentProgress, badge.requirement)
  
  let unlocked = false
  if (badge.progress >= badge.requirement) {
    badge.unlocked = true
    badge.unlockedAt = new Date().toISOString()
    badgeData.totalPoints += BADGES[badgeId].points
    badgeData.level = calculateUserLevel(badgeData.totalPoints)
    unlocked = true
  }
  
  localStorage.setItem('safespace_badges', JSON.stringify(badgeData))
  
  return {
    badge: BADGES[badgeId],
    unlocked,
    progress: badge.progress,
    wasClose: wasClose && !unlocked
  }
}

export const addPoints = (points, reason) => {
  const badgeData = JSON.parse(localStorage.getItem('safespace_badges'))
  badgeData.totalPoints += points
  badgeData.level = calculateUserLevel(badgeData.totalPoints)
  localStorage.setItem('safespace_badges', JSON.stringify(badgeData))
  
  return badgeData.totalPoints
}

export const checkMoodLogBadges = () => {
  const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
  const moodCount = Object.keys(moods).length
  
  const results = []
  
  // First Steps
  if (moodCount >= 1) {
    const result = checkBadgeProgress('first-steps', 1)
    if (result) results.push(result)
  }
  
  // Century Club
  if (moodCount >= 1) {
    const result = checkBadgeProgress('century-club', moodCount)
    if (result) results.push(result)
  }
  
  // Calculate streak for streak badges
  const moodEntries = Object.entries(moods).sort(([a], [b]) => new Date(a) - new Date(b))
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1
  
  if (moodEntries.length > 0) {
    currentStreak = 1
    for (let i = 1; i < moodEntries.length; i++) {
      const prevDate = new Date(moodEntries[i - 1][0])
      const currentDate = new Date(moodEntries[i][0])
      const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24)
      
      if (dayDiff === 1) {
        tempStreak++
        currentStreak = tempStreak
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
        currentStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)
  }
  
  // Week Warrior
  if (currentStreak >= 1) {
    const result = checkBadgeProgress('week-warrior', currentStreak)
    if (result) results.push(result)
  }
  
  // Month Master
  if (currentStreak >= 1) {
    const result = checkBadgeProgress('month-master', currentStreak)
    if (result) results.push(result)
  }
  
  // Positive Vibes - 7 consecutive happy moods
  const recentMoods = moodEntries.slice(-7).map(([, mood]) => mood.mood)
  if (recentMoods.length >= 7 && recentMoods.every(mood => mood >= 4)) {
    const result = checkBadgeProgress('positive-vibes', 7)
    if (result) results.push(result)
  }
  
  return results
}

export const checkCommunityBadges = () => {
  const posts = JSON.parse(localStorage.getItem('safespace_user_posts') || '[]')
  const circles = JSON.parse(localStorage.getItem('safespace_circles') || '[]')
  const hearted = JSON.parse(localStorage.getItem('safespace_hearted') || '[]')
  
  const results = []
  
  // Conversation Starter
  if (posts.length >= 1) {
    const result = checkBadgeProgress('conversation-starter', 1)
    if (result) results.push(result)
  }
  
  // Circle Builder
  if (circles.length >= 1) {
    const result = checkBadgeProgress('circle-builder', circles.length)
    if (result) results.push(result)
  }
  
  // Voice Heard - posts in different circles
  const uniqueCircles = new Set(posts.map(post => post.circleId))
  if (uniqueCircles.size >= 1) {
    const result = checkBadgeProgress('voice-heard', uniqueCircles.size)
    if (result) results.push(result)
  }
  
  return results
}