// Content Moderation System

export const REPORT_REASONS = {
  spam: 'Spam or misleading',
  harassment: 'Harassment or bullying',
  inappropriate: 'Inappropriate content',
  selfHarm: 'Self-harm or suicide',
  other: 'Other'
}

export const reportPost = (postId, reason, details, reporterId) => {
  const reports = JSON.parse(localStorage.getItem('safespace_reports') || '[]')
  
  const report = {
    id: Date.now(),
    postId,
    reason,
    details,
    reporterId,
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
  
  reports.push(report)
  localStorage.setItem('safespace_reports', JSON.stringify(reports))
  
  return report
}

export const blockUser = (userId, blockedUserId) => {
  const blocks = JSON.parse(localStorage.getItem('safespace_blocks') || '{}')
  
  if (!blocks[userId]) {
    blocks[userId] = []
  }
  
  if (!blocks[userId].includes(blockedUserId)) {
    blocks[userId].push(blockedUserId)
  }
  
  localStorage.setItem('safespace_blocks', JSON.stringify(blocks))
  return blocks[userId]
}

export const unblockUser = (userId, blockedUserId) => {
  const blocks = JSON.parse(localStorage.getItem('safespace_blocks') || '{}')
  
  if (blocks[userId]) {
    blocks[userId] = blocks[userId].filter(id => id !== blockedUserId)
  }
  
  localStorage.setItem('safespace_blocks', JSON.stringify(blocks))
  return blocks[userId] || []
}

export const isBlocked = (userId, targetUserId) => {
  const blocks = JSON.parse(localStorage.getItem('safespace_blocks') || '{}')
  return blocks[userId]?.includes(targetUserId) || false
}

export const hidePost = (postId, userId) => {
  const hidden = JSON.parse(localStorage.getItem('safespace_hidden_posts') || '{}')
  
  if (!hidden[userId]) {
    hidden[userId] = []
  }
  
  if (!hidden[userId].includes(postId)) {
    hidden[userId].push(postId)
  }
  
  localStorage.setItem('safespace_hidden_posts', JSON.stringify(hidden))
  return hidden[userId]
}

export const isHidden = (postId, userId) => {
  const hidden = JSON.parse(localStorage.getItem('safespace_hidden_posts') || '{}')
  return hidden[userId]?.includes(postId) || false
}

export const getBlockedUsers = (userId) => {
  const blocks = JSON.parse(localStorage.getItem('safespace_blocks') || '{}')
  return blocks[userId] || []
}

export const filterBlockedContent = (posts, userId) => {
  const blockedUsers = getBlockedUsers(userId)
  const hidden = JSON.parse(localStorage.getItem('safespace_hidden_posts') || '{}')
  const hiddenPosts = hidden[userId] || []
  
  return posts.filter(post => 
    !blockedUsers.includes(post.author) && 
    !hiddenPosts.includes(post.id)
  )
}
