// Mood analysis utility functions

export const calculateAverageMood = (moods, dateRange) => {
  if (moods.length === 0) return 0
  return moods.reduce((sum, mood) => sum + mood.mood, 0) / moods.length
}

export const detectWeekdayPatterns = (moods) => {
  const weekdayMoods = {}
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  moods.forEach(mood => {
    const dayOfWeek = new Date(mood.date).getDay()
    if (!weekdayMoods[dayOfWeek]) weekdayMoods[dayOfWeek] = []
    weekdayMoods[dayOfWeek].push(mood.mood)
  })

  const patterns = {}
  Object.entries(weekdayMoods).forEach(([day, moodValues]) => {
    const avg = moodValues.reduce((sum, mood) => sum + mood, 0) / moodValues.length
    patterns[dayNames[day]] = { average: avg, count: moodValues.length }
  })

  return patterns
}

export const calculateTrend = (currentPeriod, previousPeriod) => {
  const currentAvg = calculateAverageMood(currentPeriod)
  const previousAvg = calculateAverageMood(previousPeriod)
  return currentAvg - previousAvg
}

export const findBestAndWorstDays = (moods) => {
  if (moods.length === 0) return { best: null, worst: null }
  
  const best = moods.reduce((best, current) => 
    current.mood > best.mood ? current : best
  )
  const worst = moods.reduce((worst, current) => 
    current.mood < worst.mood ? current : worst
  )
  
  return { best, worst }
}

export const calculateConsistencyScore = (moods, totalDays) => {
  return Math.round((moods.length / totalDays) * 100)
}

export const calculateStreak = (moods) => {
  if (moods.length === 0) return { current: 0, longest: 0 }
  
  const sortedDates = moods.map(m => m.date).sort()
  let currentStreak = 1
  let longestStreak = 1
  let tempStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currentDate = new Date(sortedDates[i])
    const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24)

    if (dayDiff === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)
  
  // Calculate current streak from today backwards
  const today = new Date().toISOString().split('T')[0]
  const todayIndex = sortedDates.indexOf(today)
  
  if (todayIndex !== -1) {
    currentStreak = 1
    for (let i = todayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(sortedDates[i])
      const nextDate = new Date(sortedDates[i + 1])
      const dayDiff = (nextDate - prevDate) / (1000 * 60 * 60 * 24)
      
      if (dayDiff === 1) {
        currentStreak++
      } else {
        break
      }
    }
  } else {
    currentStreak = 0
  }

  return { current: currentStreak, longest: longestStreak }
}

export const detectMoodTriggers = (moods) => {
  const weekdayPatterns = detectWeekdayPatterns(moods)
  const overallAvg = calculateAverageMood(moods)
  
  const triggers = {
    negative: [],
    positive: []
  }

  // Detect negative patterns
  Object.entries(weekdayPatterns).forEach(([day, data]) => {
    if (data.average < overallAvg - 0.5 && data.count >= 2) {
      triggers.negative.push(`Often on ${day}s`)
    }
  })

  // Detect positive patterns
  Object.entries(weekdayPatterns).forEach(([day, data]) => {
    if (data.average > overallAvg + 0.5 && data.count >= 2) {
      triggers.positive.push(`${day}s boost your mood`)
    }
  })

  // Weekend vs weekday analysis
  const weekendDays = ['Saturday', 'Sunday']
  const weekdayAvg = Object.entries(weekdayPatterns)
    .filter(([day]) => !weekendDays.includes(day))
    .reduce((sum, [, data]) => sum + data.average, 0) / 5

  const weekendAvg = Object.entries(weekdayPatterns)
    .filter(([day]) => weekendDays.includes(day))
    .reduce((sum, [, data]) => sum + data.average, 0) / 2

  if (weekendAvg > weekdayAvg + 0.5) {
    triggers.positive.push('Weekends lift your spirits')
  }

  return triggers
}

export const generateInsights = (moods, circleActivity = [], userData = {}) => {
  if (moods.length < 3) return []

  const insights = []
  const averageMood = calculateAverageMood(moods)
  const weekdayPatterns = detectWeekdayPatterns(moods)
  const streak = calculateStreak(moods)
  const { best, worst } = findBestAndWorstDays(moods)

  // Great week insight
  if (averageMood >= 4.0) {
    const goodDays = moods.filter(m => m.mood >= 4).length
    const percentage = Math.round((goodDays / moods.length) * 100)
    insights.push({
      type: 'positive',
      icon: '🎉',
      title: 'You had a great week!',
      description: `Your mood was positive or better ${percentage}% of the time. That's wonderful!`,
      color: 'success'
    })
  }

  // Tough week insight
  if (averageMood < 2.5) {
    insights.push({
      type: 'support',
      icon: '🤗',
      title: 'This week was challenging',
      description: 'Remember that tough times don\'t last, but resilient people like you do. Consider reaching out for support.',
      color: 'warning'
    })
  }

  // Monday blues detection
  if (weekdayPatterns.Monday && weekdayPatterns.Monday.average < averageMood - 0.5) {
    insights.push({
      type: 'pattern',
      icon: '📅',
      title: 'Monday blues detected',
      description: 'Your mood tends to dip on Mondays. Consider starting your week with something you enjoy.',
      color: 'primary'
    })
  }

  // Consistency insight
  if (streak.current >= 7) {
    insights.push({
      type: 'habit',
      icon: '✨',
      title: 'You\'re building a healthy habit',
      description: 'Consistent tracking helps identify patterns. Keep it up!',
      color: 'success'
    })
  }

  // Weekend boost
  const weekendDays = ['Saturday', 'Sunday']
  const weekendMoods = moods.filter(m => {
    const dayName = new Date(m.date).toLocaleDateString('en-US', { weekday: 'long' })
    return weekendDays.includes(dayName)
  })
  
  if (weekendMoods.length >= 2) {
    const weekendAvg = calculateAverageMood(weekendMoods)
    if (weekendAvg > averageMood + 0.5) {
      insights.push({
        type: 'pattern',
        icon: '🌅',
        title: 'Weekends recharge you',
        description: 'Your mood consistently improves on weekends. Make sure to prioritize rest and activities you enjoy.',
        color: 'secondary'
      })
    }
  }

  return insights.slice(0, 4) // Return max 4 insights
}

export const generateSuggestions = (moods, userData = {}, circleActivity = []) => {
  const suggestions = []
  const averageMood = calculateAverageMood(moods)
  const streak = calculateStreak(moods)
  const joinedCircles = JSON.parse(localStorage.getItem('safespace_circles') || '[]')
  const userInterests = userData.interests || []

  // Circle suggestions based on interests
  if (userInterests.includes('anxiety') && !joinedCircles.includes(1)) {
    suggestions.push({
      icon: '🌊',
      title: 'Join the Anxiety Support circle',
      description: 'Connect with others who understand your experience',
      action: 'Join Circle',
      type: 'circle'
    })
  }

  // Consistency suggestions
  if (streak.current < 3) {
    suggestions.push({
      icon: '⏰',
      title: 'Set a morning mood reminder',
      description: 'Daily check-ins help build awareness and track progress',
      action: 'Set Reminder',
      type: 'habit'
    })
  }

  // Stress management
  if (averageMood < 3.5) {
    suggestions.push({
      icon: '🫁',
      title: 'Try the 5-minute breathing exercise',
      description: 'Deep breathing can help reduce stress and improve mood',
      action: 'Start Exercise',
      type: 'wellness'
    })
  }

  // Community engagement
  if (averageMood >= 4.0 && !joinedCircles.includes(8)) {
    suggestions.push({
      icon: '✨',
      title: 'Share your wins in General Wellness',
      description: 'Your positive energy could inspire others in the community',
      action: 'Share Story',
      type: 'community'
    })
  }

  return suggestions.slice(0, 4)
}

export const getMoodBreakdown = (moods) => {
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  
  moods.forEach(mood => {
    breakdown[mood.mood]++
  })

  return breakdown
}