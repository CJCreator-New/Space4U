// Image optimization utilities for Space4U Mobile App
// This file provides comprehensive image handling with responsive sizing,
// lazy loading, format optimization, and performance monitoring

import { useDeviceCapabilities, useResponsiveImage, useAvatarSize } from './useResponsiveImage'
import { useImagePreloader, useLazyImageWithPreload } from './useImagePreloader'

// Main image optimization hook that combines all features
export function useOptimizedImage(src, options = {}) {
  const {
    responsive = true,
    lazy = true,
    preload = false,
    priority = false,
    sizes: customSizes,
    formats: customFormats,
    quality: customQuality,
    ...imgProps
  } = options

  const capabilities = useDeviceCapabilities()
  const responsiveSources = useResponsiveImage(src, {
    sizes: customSizes,
    formats: customFormats,
    quality: customQuality
  })

  const lazyState = useLazyImageWithPreload(src, {
    enabled: lazy && !priority
  })

  // Preload critical images
  useImagePreloader(preload && src ? [src] : [])

  const getOptimizedProps = () => {
    const baseProps = {
      ...imgProps,
      alt: imgProps.alt || ''
    }

    if (priority || !lazy) {
      // Load immediately for priority images
      return {
        ...baseProps,
        src: responsive ? responsiveSources.src : src,
        srcSet: responsive ? responsiveSources.srcSet : undefined,
        sizes: responsive ? responsiveSources.sizes : undefined
      }
    }

    if (lazy && lazyState.shouldPreload) {
      // Image is near viewport, start loading
      return {
        ...baseProps,
        src: responsive ? responsiveSources.src : src,
        srcSet: responsive ? responsiveSources.srcSet : undefined,
        sizes: responsive ? responsiveSources.sizes : undefined,
        ref: lazyState.ref
      }
    }

    // Image not yet in preload zone
    return {
      ...baseProps,
      ref: lazyState.ref,
      'data-src': responsive ? responsiveSources.src : src,
      'data-srcset': responsive ? responsiveSources.srcSet : undefined,
      'data-sizes': responsive ? responsiveSources.sizes : undefined
    }
  }

  return {
    ...lazyState,
    getOptimizedProps,
    capabilities,
    responsiveSources
  }
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

// Image CDN utility for dynamic image URLs
export function createImageUrl(baseUrl, options = {}) {
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    fit = 'cover'
  } = options

  const params = new URLSearchParams()

  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())
  if (quality) params.append('q', quality.toString())
  if (format) params.append('fmt', format)
  if (fit) params.append('fit', fit)

  return `${baseUrl}?${params.toString()}`
}

// Batch image optimization for galleries
export function useOptimizedImageGallery(images = [], options = {}) {
  const {
    batchSize = 10,
    priorityCount = 3,
    ...imageOptions
  } = options

  const [visibleRange, setVisibleRange] = useState({ start: 0, end: batchSize })

  const optimizedImages = useMemo(() => {
    return images.map((image, index) => ({
      ...image,
      priority: index < priorityCount,
      lazy: index >= priorityCount,
      ...imageOptions
    }))
  }, [images, priorityCount, imageOptions])

  const loadMore = useCallback(() => {
    setVisibleRange(prev => ({
      start: prev.start,
      end: Math.min(prev.end + batchSize, images.length)
    }))
  }, [batchSize, images.length])

  return {
    optimizedImages: optimizedImages.slice(visibleRange.start, visibleRange.end),
    hasMore: visibleRange.end < images.length,
    loadMore,
    visibleRange
  }
}

// Export all utilities
export {
  useDeviceCapabilities,
  useResponsiveImage,
  useAvatarSize,
  useImagePreloader,
  useLazyImageWithPreload
}