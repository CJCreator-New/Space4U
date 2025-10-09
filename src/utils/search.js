// Global Search Utility

export const searchAll = (query) => {
  if (!query || query.length < 2) return []
  
  const results = []
  const lowerQuery = query.toLowerCase()
  
  // Search moods
  const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
  Object.entries(moods).forEach(([date, mood]) => {
    if (mood.note?.toLowerCase().includes(lowerQuery) || mood.label?.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'mood',
        title: `Mood: ${mood.label}`,
        description: mood.note || 'No note',
        date,
        link: '/insights',
        icon: mood.emoji
      })
    }
  })
  
  // Search circles
  const circles = JSON.parse(localStorage.getItem('safespace_user_circles') || '[]')
  circles.forEach(circle => {
    if (circle.name?.toLowerCase().includes(lowerQuery) || circle.description?.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'circle',
        title: circle.name,
        description: circle.description,
        link: `/circles/${circle.id}`,
        icon: circle.icon
      })
    }
  })
  
  // Search posts
  const posts = JSON.parse(localStorage.getItem('safespace_user_posts') || '[]')
  posts.forEach(post => {
    if (post.content?.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'post',
        title: 'Your post',
        description: post.content.slice(0, 100),
        date: post.createdAt,
        link: `/circles/${post.circleId}`,
        icon: '📝'
      })
    }
  })
  
  // Search gratitude
  const gratitude = JSON.parse(localStorage.getItem('safespace_gratitude') || '[]')
  gratitude.forEach(entry => {
    if (entry.text?.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'gratitude',
        title: 'Gratitude entry',
        description: entry.text,
        date: entry.date,
        link: '/gratitude',
        icon: '🙏'
      })
    }
  })
  
  // Search habits
  const habits = JSON.parse(localStorage.getItem('safespace_habits') || '[]')
  habits.forEach(habit => {
    if (habit.name?.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'habit',
        title: habit.name,
        description: `${habit.streak || 0} day streak`,
        link: '/habits',
        icon: habit.icon || '✓'
      })
    }
  })
  
  return results.slice(0, 20) // Limit to 20 results
}

export const filterMoods = (moods, filters) => {
  let filtered = [...moods]
  
  if (filters.moodLevel) {
    filtered = filtered.filter(m => m.mood === parseInt(filters.moodLevel))
  }
  
  if (filters.dateFrom) {
    filtered = filtered.filter(m => new Date(m.date) >= new Date(filters.dateFrom))
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(m => new Date(m.date) <= new Date(filters.dateTo))
  }
  
  if (filters.hasNote) {
    filtered = filtered.filter(m => m.note && m.note.length > 0)
  }
  
  if (filters.searchText) {
    const query = filters.searchText.toLowerCase()
    filtered = filtered.filter(m => 
      m.note?.toLowerCase().includes(query) || 
      m.label?.toLowerCase().includes(query)
    )
  }
  
  return filtered
}

export const getRecentSearches = () => {
  return JSON.parse(localStorage.getItem('safespace_recent_searches') || '[]')
}

export const saveSearch = (query) => {
  const recent = getRecentSearches()
  const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5)
  localStorage.setItem('safespace_recent_searches', JSON.stringify(updated))
}

export const clearRecentSearches = () => {
  localStorage.removeItem('safespace_recent_searches')
}
