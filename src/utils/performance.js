// Performance monitoring utilities

export function measurePerformance(name, fn) {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  if (import.meta.env.DEV) {
    console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`)
  }
  
  return result
}

export async function measureAsyncPerformance(name, fn) {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  
  if (import.meta.env.DEV) {
    console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`)
  }
  
  return result
}

// Debounce function for performance
export function debounce(fn, delay = 300) {
  let timeoutId
  
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle function for performance
export function throttle(fn, limit = 300) {
  let inThrottle
  
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Report Web Vitals
export function reportWebVitals() {
  if ('web-vital' in window) {
    // Report Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`📊 ${entry.name}:`, entry.value)
      }
    })
    
    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] })
  }
}
