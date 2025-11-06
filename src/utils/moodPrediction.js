export function predictMood(moods) {
  if (moods.length < 7) return null
  
  const recent = moods.slice(-7)
  const trend = recent.reduce((sum, m, i) => sum + m.mood * (i + 1), 0) / 28
  const avg = recent.reduce((sum, m) => sum + m.mood, 0) / 7
  
  const prediction = Math.max(1, Math.min(5, Math.round(avg + trend)))
  const confidence = Math.min(95, 60 + (moods.length * 0.5))
  
  return {
    predictedMood: prediction,
    confidence: Math.round(confidence),
    trend: trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable',
    recommendation: getRecommendation(prediction, trend)
  }
}

function getRecommendation(mood, trend) {
  if (mood <= 2 || trend < -0.2) {
    return 'Consider reaching out to support or trying a coping skill'
  }
  if (mood >= 4 && trend > 0.1) {
    return 'Keep up the great work! Your mood is trending positively'
  }
  return 'Continue tracking your mood to identify patterns'
}

export function detectPatterns(moods) {
  const weekdayMoods = {}
  moods.forEach(m => {
    const day = new Date(m.date).getDay()
    if (!weekdayMoods[day]) weekdayMoods[day] = []
    weekdayMoods[day].push(m.mood)
  })
  
  const patterns = Object.entries(weekdayMoods).map(([day, moods]) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
    avgMood: moods.reduce((a, b) => a + b, 0) / moods.length
  }))
  
  return patterns.sort((a, b) => a.avgMood - b.avgMood)
}
