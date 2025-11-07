import { useEffect, useState, useCallback } from 'react'

// Preload critical images for better performance
export function useImagePreloader(imageUrls = []) {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(new Set())

  useEffect(() => {
    if (!imageUrls.length) return

    setLoading(true)
    const loadPromises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, url]))
          resolve(url)
        }

        img.onerror = () => {
          setErrors(prev => new Set([...prev, url]))
          reject(url)
        }

        img.src = url
      })
    })

    Promise.allSettled(loadPromises).finally(() => {
      setLoading(false)
    })
  }, [imageUrls])

  return {
    loadedImages,
    loading,
    errors,
    allLoaded: loadedImages.size === imageUrls.length && !loading
  }
}

// Preload images for a specific component
export function preloadImages(urls) {
  urls.forEach(url => {
    const img = new Image()
    img.src = url
  })
}

// Intersection Observer hook for lazy loading with preloading
export function useLazyImageWithPreload(src, options = {}) {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    preloadDistance = 2 // Preload images 2 viewport heights ahead
  } = options

  const [isInView, setIsInView] = useState(false)
  const [shouldPreload, setShouldPreload] = useState(false)
  const [imageRef, setImageRef] = useState(null)

  useEffect(() => {
    if (!imageRef) return

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPreload(true)
          preloadObserver.disconnect()
        }
      },
      {
        rootMargin: `${preloadDistance * 100}px`,
        threshold: 0.1
      }
    )

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          viewObserver.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    preloadObserver.observe(imageRef)
    viewObserver.observe(imageRef)

    return () => {
      preloadObserver.disconnect()
      viewObserver.disconnect()
    }
  }, [imageRef, rootMargin, threshold, preloadDistance])

  // Preload image when close to viewport
  useEffect(() => {
    if (shouldPreload && src) {
      const img = new Image()
      img.src = src
    }
  }, [shouldPreload, src])

  return {
    ref: setImageRef,
    isInView,
    shouldPreload
  }
}

// Critical resource preloader for above-the-fold content
export function useCriticalResourcePreloader(resources = []) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const preloadPromises = resources.map(resource => {
      if (resource.type === 'image') {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(resource.url)
          img.onerror = () => reject(resource.url)
          img.src = resource.url
        })
      } else if (resource.type === 'font') {
        return new Promise((resolve, reject) => {
          const font = new FontFace(resource.family, `url(${resource.url})`)
          font.load().then(() => {
            document.fonts.add(font)
            resolve(resource.url)
          }).catch(reject)
        })
      }
      return Promise.resolve()
    })

    Promise.allSettled(preloadPromises).then(() => {
      setLoaded(true)
    })
  }, [resources])

  return loaded
}

// Performance monitoring for images
export function useImagePerformanceTracker() {
  const [metrics, setMetrics] = useState({
    loaded: 0,
    failed: 0,
    totalSize: 0,
    loadTime: 0
  })

  const trackImageLoad = useCallback((url, success, size = 0, time = 0) => {
    setMetrics(prev => ({
      loaded: prev.loaded + (success ? 1 : 0),
      failed: prev.failed + (success ? 0 : 1),
      totalSize: prev.totalSize + size,
      loadTime: prev.loadTime + time
    }))
  }, [])

  const getAverageLoadTime = useCallback(() => {
    const totalImages = metrics.loaded + metrics.failed
    return totalImages > 0 ? metrics.loadTime / totalImages : 0
  }, [metrics])

  const getSuccessRate = useCallback(() => {
    const total = metrics.loaded + metrics.failed
    return total > 0 ? (metrics.loaded / total) * 100 : 0
  }, [metrics])

  return {
    metrics,
    trackImageLoad,
    getAverageLoadTime,
    getSuccessRate
  }
}