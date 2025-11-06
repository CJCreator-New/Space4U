// Post Bookmarking System

export const addBookmark = (postId, userId) => {
  const bookmarks = JSON.parse(localStorage.getItem('space4u_bookmarks') || '{}')
  
  if (!bookmarks[userId]) {
    bookmarks[userId] = []
  }
  
  if (!bookmarks[userId].includes(postId)) {
    bookmarks[userId].push(postId)
    bookmarks[userId].sort((a, b) => b - a) // Most recent first
  }
  
  localStorage.setItem('space4u_bookmarks', JSON.stringify(bookmarks))
  return bookmarks[userId]
}

export const removeBookmark = (postId, userId) => {
  const bookmarks = JSON.parse(localStorage.getItem('space4u_bookmarks') || '{}')
  
  if (bookmarks[userId]) {
    bookmarks[userId] = bookmarks[userId].filter(id => id !== postId)
  }
  
  localStorage.setItem('space4u_bookmarks', JSON.stringify(bookmarks))
  return bookmarks[userId] || []
}

export const toggleBookmark = (postId, userId) => {
  if (isBookmarked(postId, userId)) {
    return removeBookmark(postId, userId)
  } else {
    return addBookmark(postId, userId)
  }
}

export const isBookmarked = (postId, userId) => {
  const bookmarks = JSON.parse(localStorage.getItem('space4u_bookmarks') || '{}')
  return bookmarks[userId]?.includes(postId) || false
}

export const getUserBookmarks = (userId) => {
  const bookmarks = JSON.parse(localStorage.getItem('space4u_bookmarks') || '{}')
  return bookmarks[userId] || []
}

export const getBookmarkedPosts = (userId, allPosts) => {
  const bookmarkIds = getUserBookmarks(userId)
  return allPosts.filter(post => bookmarkIds.includes(post.id))
}

export const getBookmarkCount = (userId) => {
  return getUserBookmarks(userId).length
}

