// Adaptive Theme Engine - Mood-Responsive Design System

export const MOOD_THEMES = {
  low: {
    name: 'Warm Support',
    primary: '#FF8C42', // Warm orange
    secondary: '#FFD93D', // Joy yellow
    background: '#FFF5E6',
    text: '#5D4037',
    gradient: 'from-orange-400 to-yellow-400'
  },
  anxious: {
    name: 'Calm Waters',
    primary: '#4ECDC4', // Sadness blue
    secondary: '#95E1D3', // Peace green
    background: '#E8F8F5',
    text: '#1A5653',
    gradient: 'from-teal-400 to-green-300'
  },
  stable: {
    name: 'Balanced Harmony',
    primary: '#6B73FF', // Serenity blue
    secondary: '#9B59B6', // Gentle lavender
    background: '#F8F9FA',
    text: '#495057',
    gradient: 'from-indigo-500 to-purple-500'
  },
  high: {
    name: 'Energized Joy',
    primary: '#2ECC71', // Warm sage
    secondary: '#FFD93D', // Joy yellow
    background: '#F0FFF4',
    text: '#2D5016',
    gradient: 'from-green-400 to-yellow-300'
  }
}

export const TIME_THEMES = {
  morning: { brightness: 1.1, saturation: 1.2, warmth: 'warm' },
  afternoon: { brightness: 1.0, saturation: 1.0, warmth: 'neutral' },
  evening: { brightness: 0.9, saturation: 0.9, warmth: 'warm' },
  night: { brightness: 0.7, saturation: 0.8, warmth: 'cool' }
}

export const getMoodTheme = (moodRating) => {
  if (moodRating <= 2) return MOOD_THEMES.low
  if (moodRating === 3) return MOOD_THEMES.anxious
  if (moodRating === 4) return MOOD_THEMES.stable
  return MOOD_THEMES.high
}

export const getTimeOfDayTheme = () => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return TIME_THEMES.morning
  if (hour >= 12 && hour < 18) return TIME_THEMES.afternoon
  if (hour >= 18 && hour < 22) return TIME_THEMES.evening
  return TIME_THEMES.night
}

export const generateAdaptiveTheme = (moodRating, userPreferences = {}) => {
  const moodTheme = getMoodTheme(moodRating)
  const timeTheme = getTimeOfDayTheme()
  
  return {
    ...moodTheme,
    timeAdjustments: timeTheme,
    userOverrides: userPreferences
  }
}

export const applyThemeToElement = (element, theme) => {
  if (!element) return
  
  element.style.setProperty('--theme-primary', theme.primary)
  element.style.setProperty('--theme-secondary', theme.secondary)
  element.style.setProperty('--theme-background', theme.background)
  element.style.setProperty('--theme-text', theme.text)
}
