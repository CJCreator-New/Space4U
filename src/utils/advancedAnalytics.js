// Advanced Analytics & Insights

export const calculateMoodCorrelations = (moods) => {
  if (moods.length < 7) return null
  
  const dayOfWeek = {}
  moods.forEach(m => {
    const day = new Date(m.date).getDay()
    if (!dayOfWeek[day]) dayOfWeek[day] = []
    dayOfWeek[day].push(m.mood)
  })
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return Object.entries(dayOfWeek).map(([day, moodList]) => ({
    day: dayNames[day],
    average: (moodList.reduce((a, b) => a + b, 0) / moodList.length).toFixed(1),
    count: moodList.length
  })).sort((a, b) => b.average - a.average)
}

export const predictNextMood = (moods) => {
  if (moods.length < 7) return null
  
  const recent = moods.slice(-7).map(m => m.mood)
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length
  const trend = recent[recent.length - 1] - recent[0]
  
  const prediction = Math.max(1, Math.min(5, Math.round(avg + (trend * 0.3))))
  const confidence = Math.min(95, 50 + (moods.length * 2))
  
  return { prediction, confidence, trend: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable' }
}

export const detectMoodPatterns = (moods) => {
  if (moods.length < 14) return []
  
  const patterns = []
  
  // Weekend vs Weekday
  const weekday = moods.filter(m => {
    const day = new Date(m.date).getDay()
    return day > 0 && day < 6
  })
  const weekend = moods.filter(m => {
    const day = new Date(m.date).getDay()
    return day === 0 || day === 6
  })
  
  if (weekday.length > 0 && weekend.length > 0) {
    const weekdayAvg = weekday.reduce((a, b) => a + b.mood, 0) / weekday.length
    const weekendAvg = weekend.reduce((a, b) => a + b.mood, 0) / weekend.length
    const diff = Math.abs(weekendAvg - weekdayAvg)
    
    if (diff > 0.5) {
      patterns.push({
        type: 'weekend_effect',
        description: weekendAvg > weekdayAvg 
          ? 'Your mood tends to be better on weekends'
          : 'Your mood tends to be better on weekdays',
        impact: diff > 1 ? 'high' : 'moderate'
      })
    }
  }
  
  // Consistency pattern
  const variance = moods.reduce((sum, m) => {
    const avg = moods.reduce((a, b) => a + b.mood, 0) / moods.length
    return sum + Math.pow(m.mood - avg, 2)
  }, 0) / moods.length
  
  if (variance < 0.5) {
    patterns.push({
      type: 'stable',
      description: 'Your mood has been very consistent',
      impact: 'positive'
    })
  } else if (variance > 2) {
    patterns.push({
      type: 'volatile',
      description: 'Your mood varies significantly day-to-day',
      impact: 'attention'
    })
  }
  
  // Trend pattern
  const firstHalf = moods.slice(0, Math.floor(moods.length / 2))
  const secondHalf = moods.slice(Math.floor(moods.length / 2))
  const firstAvg = firstHalf.reduce((a, b) => a + b.mood, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((a, b) => a + b.mood, 0) / secondHalf.length
  const trendDiff = secondAvg - firstAvg
  
  if (Math.abs(trendDiff) > 0.5) {
    patterns.push({
      type: 'trend',
      description: trendDiff > 0 
        ? 'Your mood has been improving over time'
        : 'Your mood has been declining recently',
      impact: trendDiff > 0 ? 'positive' : 'attention'
    })
  }
  
  return patterns
}

export const generatePersonalizedInsights = (moods, userData) => {
  if (moods.length < 7) return []
  
  const insights = []
  const recent = moods.slice(-7)
  const avg = recent.reduce((a, b) => a + b.mood, 0) / recent.length
  
  // Consistency insight
  const consistency = (recent.length / 7) * 100
  if (consistency === 100) {
    insights.push({
      type: 'achievement',
      title: 'Perfect Week!',
      message: 'You logged your mood every day this week. Keep it up!',
      icon: '🎯'
    })
  }
  
  // Mood level insight
  if (avg >= 4) {
    insights.push({
      type: 'positive',
      title: 'Great Week',
      message: 'Your mood has been consistently good this week.',
      icon: '😊'
    })
  } else if (avg < 2.5) {
    insights.push({
      type: 'support',
      title: 'Tough Week',
      message: 'It looks like this week has been challenging. Consider reaching out to support.',
      icon: '💙'
    })
  }
  
  // Streak insight
  const streak = calculateCurrentStreak(moods)
  if (streak >= 7) {
    insights.push({
      type: 'milestone',
      title: `${streak} Day Streak!`,
      message: 'Your consistency is impressive. Keep tracking!',
      icon: '🔥'
    })
  }
  
  return insights
}

const calculateCurrentStreak = (moods) => {
  if (moods.length === 0) return 0
  
  const sorted = [...moods].sort((a, b) => new Date(b.date) - new Date(a.date))
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (const mood of sorted) {
    const moodDate = new Date(mood.date)
    moodDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.floor((currentDate - moodDate) / (1000 * 60 * 60 * 24))
    
    if (diffDays === streak) {
      streak++
      currentDate = moodDate
    } else {
      break
    }
  }
  
  return streak
}

export const generateRecommendations = (moods, patterns) => {
  const recommendations = []
  
  patterns.forEach(pattern => {
    if (pattern.type === 'weekend_effect' && pattern.description.includes('weekdays')) {
      recommendations.push({
        title: 'Weekend Self-Care',
        description: 'Plan relaxing activities for weekends to boost your mood',
        action: 'View Resources'
      })
    }
    
    if (pattern.type === 'volatile') {
      recommendations.push({
        title: 'Mood Stability',
        description: 'Try daily meditation or breathing exercises for more consistent mood',
        action: 'Try Breathing Exercise'
      })
    }
    
    if (pattern.type === 'trend' && pattern.description.includes('declining')) {
      recommendations.push({
        title: 'Reach Out',
        description: 'Consider connecting with a support circle or professional',
        action: 'Browse Circles'
      })
    }
  })
  
  return recommendations
}
