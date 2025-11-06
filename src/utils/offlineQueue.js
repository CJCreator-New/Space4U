// Queue for offline actions
class OfflineQueue {
  constructor() {
    this.queue = this.loadQueue()
    this.isOnline = navigator.onLine
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processQueue()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  loadQueue() {
    try {
      const stored = localStorage.getItem('offline_queue')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  saveQueue() {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(this.queue))
    } catch (error) {
      console.error('Failed to save offline queue:', error)
    }
  }

  addAction(action) {
    const queueItem = {
      id: Date.now() + Math.random(),
      action,
      timestamp: new Date().toISOString(),
      retries: 0
    }
    
    this.queue.push(queueItem)
    this.saveQueue()
    
    // Try to process immediately if online
    if (this.isOnline) {
      this.processQueue()
    }
    
    return queueItem.id
  }

  async processQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return
    }

    const itemsToProcess = [...this.queue]
    
    for (const item of itemsToProcess) {
      try {
        await this.executeAction(item.action)
        this.removeFromQueue(item.id)
      } catch (error) {
        console.error('Failed to process queued action:', error)
        item.retries++
        
        // Remove items that have failed too many times
        if (item.retries >= 3) {
          this.removeFromQueue(item.id)
        }
      }
    }
    
    this.saveQueue()
  }

  async executeAction(action) {
    switch (action.type) {
      case 'MOOD_LOG':
        return this.syncMoodLog(action.data)
      case 'POST_CREATE':
        return this.syncPost(action.data)
      case 'COMMENT_CREATE':
        return this.syncComment(action.data)
      default:
        console.warn('Unknown action type:', action.type)
    }
  }

  async syncMoodLog(data) {
    // In a real app, this would sync to a server
    console.log('Syncing mood log:', data)
    
    // For now, just ensure it's in localStorage
    const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
    moods[data.date] = data
    localStorage.setItem('space4u_moods', JSON.stringify(moods))
  }

  async syncPost(data) {
    // In a real app, this would sync to a server
    console.log('Syncing post:', data)
    
    // For now, just ensure it's in localStorage
    const posts = JSON.parse(localStorage.getItem('space4u_user_posts') || '[]')
    posts.push(data)
    localStorage.setItem('space4u_user_posts', JSON.stringify(posts))
  }

  async syncComment(data) {
    // In a real app, this would sync to a server
    console.log('Syncing comment:', data)
  }

  removeFromQueue(id) {
    this.queue = this.queue.filter(item => item.id !== id)
  }

  getQueueLength() {
    return this.queue.length
  }

  clearQueue() {
    this.queue = []
    this.saveQueue()
  }
}

// Create singleton instance
export const offlineQueue = new OfflineQueue()

// Helper functions
export const queueMoodLog = (moodData) => {
  return offlineQueue.addAction({
    type: 'MOOD_LOG',
    data: moodData
  })
}

export const queuePost = (postData) => {
  return offlineQueue.addAction({
    type: 'POST_CREATE',
    data: postData
  })
}

export const queueComment = (commentData) => {
  return offlineQueue.addAction({
    type: 'COMMENT_CREATE',
    data: commentData
  })
}

export default offlineQueue
