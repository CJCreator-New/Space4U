// Format timestamp to relative time
export const formatRelativeTime = (timestamp) => {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInSeconds = Math.floor((now - past) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  return `${Math.floor(diffInSeconds / 2592000)} months ago`
}

// Generate random anonymous username
export const generateUsername = () => {
  const adjectives = [
    'Peaceful', 'Calm', 'Gentle', 'Kind', 'Brave', 'Strong', 'Wise', 'Hopeful',
    'Caring', 'Loving', 'Bright', 'Quiet', 'Mindful', 'Grateful', 'Resilient',
    'Supportive', 'Understanding', 'Compassionate', 'Healing', 'Growing'
  ]
  
  const animals = [
    'Bear', 'Fox', 'Owl', 'Cat', 'Dog', 'Bird', 'Butterfly', 'Bee', 'Deer',
    'Wolf', 'Rabbit', 'Panda', 'Swan', 'Dove', 'Eagle', 'Turtle', 'Dolphin',
    'Elephant', 'Lion', 'Tiger', 'Penguin', 'Koala', 'Hedgehog', 'Otter'
  ]
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  
  return `${adjective}${animal}`
}

// Basic profanity filter (placeholder)
export const filterProfanity = (text) => {
  const profanityList = ['badword1', 'badword2'] // Placeholder list
  let filteredText = text
  
  profanityList.forEach(word => {
    const regex = new RegExp(word, 'gi')
    filteredText = filteredText.replace(regex, '*'.repeat(word.length))
  })
  
  return filteredText
}

// Calculate reading time in minutes
export const calculateReadTime = (text) => {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  
  return readTime === 1 ? '1 min read' : `${readTime} min read`
}

// Format large numbers (e.g., 1234 -> 1.2k)
export const formatNumber = (num) => {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}k`
  return `${(num / 1000000).toFixed(1)}m`
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Get random item from array
export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

// Validate username format
export const validateUsername = (username) => {
  const minLength = 3
  const maxLength = 20
  const validPattern = /^[a-zA-Z0-9_]+$/
  
  if (username.length < minLength) return 'Username must be at least 3 characters'
  if (username.length > maxLength) return 'Username must be 20 characters or less'
  if (!validPattern.test(username)) return 'Only letters, numbers, and underscores allowed'
  
  return null // No error
}