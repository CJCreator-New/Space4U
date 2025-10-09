// Simple memoization utility for expensive calculations

export function memoize(fn) {
  const cache = new Map()
  
  return function(...args) {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn.apply(this, args)
    cache.set(key, result)
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }
}

// Memoize with time-based expiration
export function memoizeWithTTL(fn, ttl = 60000) {
  const cache = new Map()
  
  return function(...args) {
    const key = JSON.stringify(args)
    const now = Date.now()
    
    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key)
      if (now - timestamp < ttl) {
        return value
      }
      cache.delete(key)
    }
    
    const result = fn.apply(this, args)
    cache.set(key, { value: result, timestamp: now })
    
    return result
  }
}
