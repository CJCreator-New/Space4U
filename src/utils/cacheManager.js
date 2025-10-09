// Advanced Cache Manager

class CacheManager {
  constructor() {
    this.memoryCache = new Map()
    this.maxMemoryCacheSize = 50 // Max items in memory
    this.cacheExpiry = 5 * 60 * 1000 // 5 minutes default
  }

  // Memory cache operations
  set(key, value, ttl = this.cacheExpiry) {
    if (this.memoryCache.size >= this.maxMemoryCacheSize) {
      const firstKey = this.memoryCache.keys().next().value
      this.memoryCache.delete(firstKey)
    }

    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + ttl
    })
  }

  get(key) {
    const cached = this.memoryCache.get(key)
    
    if (!cached) return null
    
    if (Date.now() > cached.expiry) {
      this.memoryCache.delete(key)
      return null
    }
    
    return cached.value
  }

  has(key) {
    return this.get(key) !== null
  }

  delete(key) {
    this.memoryCache.delete(key)
  }

  clear() {
    this.memoryCache.clear()
  }

  // Batch operations
  setMany(entries) {
    entries.forEach(([key, value, ttl]) => this.set(key, value, ttl))
  }

  getMany(keys) {
    return keys.map(key => this.get(key))
  }

  // Cache statistics
  getStats() {
    return {
      size: this.memoryCache.size,
      maxSize: this.maxMemoryCacheSize,
      keys: Array.from(this.memoryCache.keys())
    }
  }
}

export const cacheManager = new CacheManager()

// Preload critical data
export const preloadCriticalData = () => {
  const keys = ['safespace_user', 'safespace_moods', 'safespace_settings']
  
  keys.forEach(key => {
    const data = localStorage.getItem(key)
    if (data) {
      cacheManager.set(key, JSON.parse(data), 10 * 60 * 1000) // 10 min cache
    }
  })
}

// Get with fallback to localStorage
export const getCached = (key, fallback = null) => {
  const cached = cacheManager.get(key)
  if (cached) return cached
  
  const stored = localStorage.getItem(key)
  if (stored) {
    const parsed = JSON.parse(stored)
    cacheManager.set(key, parsed)
    return parsed
  }
  
  return fallback
}

// Set with cache and localStorage
export const setCached = (key, value) => {
  cacheManager.set(key, value)
  localStorage.setItem(key, JSON.stringify(value))
}
