// Post Reaction System

export const REACTIONS = {
  heart: { emoji: 'â¤ï¸', label: 'Heart' },
  like: { emoji: '', label: 'Like' },
  support: { emoji: '', label: 'Support' },
  strength: { emoji: '', label: 'Strength' },
  hug: { emoji: '', label: 'Hug' },
  celebrate: { emoji: '', label: 'Celebrate' }
}

export const addReaction = (postId, reactionType, userId) => {
  const reactions = JSON.parse(localStorage.getItem('space4u_reactions') || '{}')
  
  if (!reactions[postId]) {
    reactions[postId] = {}
  }
  
  if (!reactions[postId][reactionType]) {
    reactions[postId][reactionType] = []
  }
  
  if (!reactions[postId][reactionType].includes(userId)) {
    reactions[postId][reactionType].push(userId)
  }
  
  localStorage.setItem('space4u_reactions', JSON.stringify(reactions))
  return reactions[postId]
}

export const removeReaction = (postId, reactionType, userId) => {
  const reactions = JSON.parse(localStorage.getItem('space4u_reactions') || '{}')
  
  if (reactions[postId]?.[reactionType]) {
    reactions[postId][reactionType] = reactions[postId][reactionType].filter(id => id !== userId)
    
    if (reactions[postId][reactionType].length === 0) {
      delete reactions[postId][reactionType]
    }
  }
  
  localStorage.setItem('space4u_reactions', JSON.stringify(reactions))
  return reactions[postId] || {}
}

export const toggleReaction = (postId, reactionType, userId) => {
  const reactions = getPostReactions(postId)
  const hasReacted = reactions[reactionType]?.includes(userId)
  
  if (hasReacted) {
    return removeReaction(postId, reactionType, userId)
  } else {
    return addReaction(postId, reactionType, userId)
  }
}

export const getPostReactions = (postId) => {
  const reactions = JSON.parse(localStorage.getItem('space4u_reactions') || '{}')
  return reactions[postId] || {}
}

export const getReactionCount = (postId) => {
  const reactions = getPostReactions(postId)
  return Object.values(reactions).reduce((sum, users) => sum + users.length, 0)
}

export const getUserReaction = (postId, userId) => {
  const reactions = getPostReactions(postId)
  for (const [type, users] of Object.entries(reactions)) {
    if (users.includes(userId)) return type
  }
  return null
}

