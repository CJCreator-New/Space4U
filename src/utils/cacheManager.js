class CacheManager {
  constructor(maxSize = 50) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  set(key, value, ttl = 300000) { // 5 min default
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    })
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }

  has(key) {
    return this.get(key) !== null
  }

  clear() {
    this.cache.clear()
  }

  delete(key) {
    this.cache.delete(key)
  }

  size() {
    return this.cache.size
  }
}

export const cacheManager = new CacheManager()

export const withCache = (key, fn, ttl) => {
  const cached = cacheManager.get(key)
  if (cached) return Promise.resolve(cached)
  
  return fn().then(result => {
    cacheManager.set(key, result, ttl)
    return result
  })
}
