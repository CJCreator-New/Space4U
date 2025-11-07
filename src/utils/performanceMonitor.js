// Performance Monitoring Utilities

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
  }

  // Measure function execution time
  measure(name, fn) {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    this.recordMetric(name, end - start)
    return result
  }

  // Measure async function execution time
  async measureAsync(name, fn) {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    this.recordMetric(name, end - start)
    return result
  }

  // Record metric
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  // Get metric statistics
  getStats(name) {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return null
    
    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    
    return {
      count: values.length,
      avg: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    }
  }

  // Get all metrics
  getAllStats() {
    const stats = {}
    this.metrics.forEach((_, name) => {
      stats[name] = this.getStats(name)
    })
    return stats
  }

  // Clear metrics
  clear() {
    this.metrics.clear()
  }

  // Log performance report
  logReport() {
    console.group('Performance Report')
    const stats = this.getAllStats()
    Object.entries(stats).forEach(([name, stat]) => {
      console.log(`${name}:`, {
        avg: `${stat.avg.toFixed(2)}ms`,
        min: `${stat.min.toFixed(2)}ms`,
        max: `${stat.max.toFixed(2)}ms`,
        p95: `${stat.p95.toFixed(2)}ms`
      })
    })
    console.groupEnd()
  }
}

export const perfMonitor = new PerformanceMonitor()

// Web Vitals monitoring
export const measureWebVitals = () => {
  if (typeof window === 'undefined') return

  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    perfMonitor.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime)
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // First Input Delay
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach(entry => {
      perfMonitor.recordMetric('FID', entry.processingStart - entry.startTime)
    })
  }).observe({ entryTypes: ['first-input'] })

  // Cumulative Layout Shift
  let clsValue = 0
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
        perfMonitor.recordMetric('CLS', clsValue)
      }
    })
  }).observe({ entryTypes: ['layout-shift'] })
}

// Initialize monitoring with cleanup
let monitoringInterval = null

export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    measureWebVitals()
    
    // Clear existing interval
    if (monitoringInterval) clearInterval(monitoringInterval)
    
    // Log report every 30 seconds
    monitoringInterval = setInterval(() => {
      perfMonitor.logReport()
    }, 30000)
    
    // Return cleanup function
    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
        monitoringInterval = null
      }
    }
  }
  return () => {} // No-op cleanup for production
}
