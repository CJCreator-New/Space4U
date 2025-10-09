// Trending Posts Algorithm

import { getPostReactions } from './reactions'

export const calculateTrendingScore = (post) => {
  const now = Date.now()
  const postAge = now - new Date(post.createdAt).getTime()
  const ageInHours = postAge / (1000 * 60 * 60)
  
  // Get engagement metrics
  const reactions = getPostReactions(post.id)
  const reactionCount = Object.values(reactions).reduce((sum, users) => sum + users.length, 0)
  const commentCount = post.comments?.length || 0
  
  // Weights
  const reactionWeight = 2
  const commentWeight = 3
  const recencyBonus = Math.max(0, 24 - ageInHours) / 24 // Boost recent posts
  
  // Calculate score
  const engagementScore = (reactionCount * reactionWeight) + (commentCount * commentWeight)
  const trendingScore = engagementScore * (1 + recencyBonus)
  
  return trendingScore
}

export const getTrendingPosts = (posts, limit = 10, timeframe = 'week') => {
  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return []
  }
  
  const now = Date.now()
  let cutoffTime
  
  switch (timeframe) {
    case 'today':
      cutoffTime = now - (24 * 60 * 60 * 1000)
      break
    case 'week':
      cutoffTime = now - (7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      cutoffTime = now - (30 * 24 * 60 * 60 * 1000)
      break
    default:
      cutoffTime = 0
  }
  
  // Filter by timeframe
  const recentPosts = posts.filter(post => {
    try {
      return post.createdAt && new Date(post.createdAt).getTime() >= cutoffTime
    } catch {
      return false
    }
  })
  
  // Calculate scores and sort
  const postsWithScores = recentPosts.map(post => ({
    ...post,
    trendingScore: calculateTrendingScore(post)
  }))
  
  return postsWithScores
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
}

export const isTrending = (post, allPosts) => {
  const trending = getTrendingPosts(allPosts, 5)
  return trending.some(p => p.id === post.id)
}
