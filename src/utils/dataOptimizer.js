// Data Operation Optimizer

// Debounce function for frequent saves
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for frequent operations
export const throttle = (func, limit = 100) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Batch localStorage operations
class BatchStorage {
  constructor() {
    this.queue = new Map()
    this.flushTimeout = null
  }

  set(key, value, immediate = false) {
    this.queue.set(key, value)
    
    if (immediate) {
      this.flush()
    } else {
      this.scheduleFlush()
    }
  }

  scheduleFlush() {
    if (this.flushTimeout) return
    
    this.flushTimeout = setTimeout(() => {
      this.flush()
    }, 100) // Batch writes every 100ms
  }

  flush() {
    this.queue.forEach((value, key) => {
      localStorage.setItem(key, JSON.stringify(value))
    })
    
    this.queue.clear()
    this.flushTimeout = null
  }

  get(key) {
    // Check queue first
    if (this.queue.has(key)) {
      return this.queue.get(key)
    }
    
    // Then check localStorage
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  }
}

export const batchStorage = new BatchStorage()

// Optimize array operations
export const optimizedFilter = (array, predicate) => {
  const result = []
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      result.push(array[i])
    }
  }
  return result
}

export const optimizedMap = (array, mapper) => {
  const result = new Array(array.length)
  for (let i = 0; i < array.length; i++) {
    result[i] = mapper(array[i], i, array)
  }
  return result
}

// Memoize expensive calculations
export const memoize = (fn) => {
  const cache = new Map()
  
  return (...args) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }
}

// Optimize search with indexing
export const createSearchIndex = (items, fields) => {
  const index = new Map()
  
  items.forEach((item, idx) => {
    fields.forEach(field => {
      const value = item[field]?.toLowerCase()
      if (!value) return
      
      const words = value.split(/\s+/)
      words.forEach(word => {
        if (!index.has(word)) {
          index.set(word, new Set())
        }
        index.get(word).add(idx)
      })
    })
  })
  
  return index
}

export const searchWithIndex = (query, items, index) => {
  const words = query.toLowerCase().split(/\s+/)
  const matchingSets = words.map(word => index.get(word) || new Set())
  
  // Intersection of all sets
  const intersection = matchingSets.reduce((acc, set) => {
    return new Set([...acc].filter(x => set.has(x)))
  })
  
  return Array.from(intersection).map(idx => items[idx])
}
