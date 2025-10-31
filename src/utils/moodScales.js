// Custom Mood Scales System

export const MOOD_SCALES = {
  scale5: {
    id: 'scale5',
    name: '5-Point Scale',
    description: 'Default balanced scale',
    points: [
      { value: 1, emoji: 'ðŸ˜°', label: 'Struggling' },
      { value: 2, emoji: 'ðŸ˜¢', label: 'Low' },
      { value: 3, emoji: 'ðŸ˜', label: 'Okay' },
      { value: 4, emoji: 'ðŸ™‚', label: 'Good' },
      { value: 5, emoji: 'ðŸ˜Š', label: 'Amazing' }
    ]
  },
  scale10: {
    id: 'scale10',
    name: '10-Point Scale',
    description: 'More granular tracking',
    points: [
      { value: 1, emoji: 'ðŸ˜­', label: 'Terrible' },
      { value: 2, emoji: 'ðŸ˜°', label: 'Very Bad' },
      { value: 3, emoji: 'ðŸ˜¢', label: 'Bad' },
      { value: 4, emoji: 'ðŸ˜”', label: 'Low' },
      { value: 5, emoji: 'ðŸ˜', label: 'Neutral' },
      { value: 6, emoji: 'ðŸ™‚', label: 'Okay' },
      { value: 7, emoji: 'ðŸ˜Š', label: 'Good' },
      { value: 8, emoji: 'ðŸ˜„', label: 'Great' },
      { value: 9, emoji: 'ðŸ¤©', label: 'Excellent' },
      { value: 10, emoji: 'ðŸ¥³', label: 'Amazing' }
    ]
  },
  scale3: {
    id: 'scale3',
    name: '3-Point Scale',
    description: 'Simple and quick',
    points: [
      { value: 1, emoji: 'ðŸ˜¢', label: 'Bad' },
      { value: 2, emoji: 'ðŸ˜', label: 'Okay' },
      { value: 3, emoji: 'ðŸ˜Š', label: 'Good' }
    ]
  }
}

export const getMoodScale = (scaleId = 'scale5') => {
  return MOOD_SCALES[scaleId] || MOOD_SCALES.scale5
}

export const getUserMoodScale = () => {
  const settings = JSON.parse(localStorage.getItem('space4u_settings') || '{}')
  return settings.moodScale || 'scale5'
}

export const setUserMoodScale = (scaleId) => {
  const settings = JSON.parse(localStorage.getItem('space4u_settings') || '{}')
  settings.moodScale = scaleId
  localStorage.setItem('space4u_settings', JSON.stringify(settings))
}

export const convertMoodValue = (value, fromScale, toScale) => {
  const from = getMoodScale(fromScale)
  const to = getMoodScale(toScale)
  
  const fromMax = from.points.length
  const toMax = to.points.length
  
  // Normalize to 0-1 range, then scale to target
  const normalized = (value - 1) / (fromMax - 1)
  const converted = Math.round(normalized * (toMax - 1)) + 1
  
  return Math.max(1, Math.min(toMax, converted))
}

