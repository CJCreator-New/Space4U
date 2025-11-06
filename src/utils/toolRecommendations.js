import { calculateAverageMood } from './moodAnalysis'

export const getRecommendedTools = (moodHistory, circleActivity = []) => {
  const moods = Object.values(moodHistory || {})
  
  if (moods.length === 0) {
    return ['breathing-exercises', 'gratitude-journal', 'mindfulness']
  }

  const avgMood = calculateAverageMood(moods)
  const recentMoods = moods.slice(-7)
  const recentAvg = recentMoods.length > 0 
    ? recentMoods.reduce((sum, m) => sum + (m.mood || m.value || 3), 0) / recentMoods.length 
    : avgMood

  // Low mood - crisis and grounding tools
  if (recentAvg < 2.5) {
    return [
      'breathing-exercises',
      'crisis-resources',
      'grounding-techniques',
      'self-compassion',
      'emergency-contacts'
    ]
  }
  
  // Moderate mood - mood boosters and coping
  if (recentAvg < 3.5) {
    return [
      'mood-boosters',
      'coping-skills',
      'mindfulness',
      'self-care-tips',
      'breathing-exercises'
    ]
  }
  
  // Good mood - maintenance and growth
  return [
    'gratitude-journal',
    'goal-setting',
    'wellness-challenges',
    'habit-tracker',
    'meditation'
  ]
}

export const getToolsByCategory = () => {
  return {
    calming: [
      { id: 'breathing-exercises', name: 'Breathing Exercises', icon: '🫁' },
      { id: 'meditation', name: 'Meditation', icon: '🧘' },
      { id: 'progressive-relaxation', name: 'Progressive Relaxation', icon: '😌' },
      { id: 'mindfulness', name: 'Mindfulness', icon: '🌸' }
    ],
    resilience: [
      { id: 'coping-skills', name: 'Coping Skills', icon: '💪' },
      { id: 'self-compassion', name: 'Self-Compassion', icon: '💝' },
      { id: 'cognitive-reframing', name: 'Cognitive Reframing', icon: '🧠' },
      { id: 'problem-solving', name: 'Problem Solving', icon: '🎯' }
    ],
    connection: [
      { id: 'support-circles', name: 'Support Circles', icon: '🤝' },
      { id: 'gratitude-journal', name: 'Gratitude Journal', icon: '📝' },
      { id: 'social-activities', name: 'Social Activities', icon: '👥' },
      { id: 'peer-support', name: 'Peer Support', icon: '💬' }
    ]
  }
}

export const getToolMetadata = (toolId) => {
  const metadata = {
    'breathing-exercises': {
      category: 'calming',
      duration: '5-10 min',
      difficulty: 'Easy',
      description: 'Guided breathing techniques to reduce stress and anxiety'
    },
    'crisis-resources': {
      category: 'resilience',
      duration: 'Immediate',
      difficulty: 'Easy',
      description: 'Emergency contacts and crisis support resources'
    },
    'gratitude-journal': {
      category: 'connection',
      duration: '10-15 min',
      difficulty: 'Easy',
      description: 'Daily gratitude practice to boost mood and well-being'
    },
    'mindfulness': {
      category: 'calming',
      duration: '10-20 min',
      difficulty: 'Medium',
      description: 'Present-moment awareness exercises'
    },
    'coping-skills': {
      category: 'resilience',
      duration: '5-30 min',
      difficulty: 'Medium',
      description: 'Practical strategies for managing difficult emotions'
    }
  }

  return metadata[toolId] || {
    category: 'general',
    duration: '10 min',
    difficulty: 'Easy',
    description: 'Wellness tool'
  }
}
