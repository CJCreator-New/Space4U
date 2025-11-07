import { useState, useEffect, useMemo } from 'react'

// Device capability detection
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    pixelRatio: 1,
    connection: 'unknown',
    memory: 'unknown',
    screenWidth: 0,
    screenHeight: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    supportsWebP: false,
    supportsAVIF: false
  })

  useEffect(() => {
    const updateCapabilities = () => {
      const pixelRatio = window.devicePixelRatio || 1
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // Device type detection
      const isMobile = screenWidth < 768
      const isTablet = screenWidth >= 768 && screenWidth < 1024
      const isDesktop = screenWidth >= 1024

      // Connection detection (if available)
      let connection = 'unknown'
      if ('connection' in navigator) {
        const conn = navigator.connection
        connection = conn?.effectiveType || 'unknown'
      }

      // Memory detection (if available)
      let memory = 'unknown'
      if ('deviceMemory' in navigator) {
        memory = navigator.deviceMemory + 'GB'
      }

      // Image format support detection
      const supportsWebP = (() => {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      })()

      const supportsAVIF = (() => {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
      })()

      setCapabilities({
        pixelRatio,
        connection,
        memory,
        screenWidth,
        screenHeight,
        isMobile,
        isTablet,
        isDesktop,
        supportsWebP,
        supportsAVIF
      })
    }

    updateCapabilities()
    window.addEventListener('resize', updateCapabilities)

    return () => window.removeEventListener('resize', updateCapabilities)
  }, [])

  return capabilities
}

// Responsive image source generation
export function useResponsiveImage(src, options = {}) {
  const {
    sizes = [320, 640, 1024, 1280, 1920],
    formats = ['webp', 'avif', 'jpg'],
    quality = { mobile: 75, tablet: 80, desktop: 85 }
  } = options

  const capabilities = useDeviceCapabilities()

  const responsiveSources = useMemo(() => {
    if (!src) return { src, srcSet: '', sizes: '' }

    // Determine optimal size based on device
    let optimalSize
    if (capabilities.isMobile) {
      optimalSize = Math.min(capabilities.screenWidth * capabilities.pixelRatio, 640)
    } else if (capabilities.isTablet) {
      optimalSize = Math.min(capabilities.screenWidth * capabilities.pixelRatio, 1024)
    } else {
      optimalSize = Math.min(capabilities.screenWidth * capabilities.pixelRatio, 1280)
    }

    // Find closest size from available sizes
    const closestSize = sizes.reduce((prev, curr) =>
      Math.abs(curr - optimalSize) < Math.abs(prev - optimalSize) ? curr : prev
    )

    // Determine quality based on device and connection
    let imageQuality = quality.desktop
    if (capabilities.isMobile) {
      imageQuality = capabilities.connection === 'slow-2g' || capabilities.connection === '2g'
        ? Math.min(quality.mobile - 15, 60)
        : quality.mobile
    } else if (capabilities.isTablet) {
      imageQuality = quality.tablet
    }

    // Generate srcSet with different sizes and formats
    const srcSetEntries = []

    // Prioritize modern formats
    const prioritizedFormats = []
    if (capabilities.supportsAVIF) prioritizedFormats.push('avif')
    if (capabilities.supportsWebP) prioritizedFormats.push('webp')
    prioritizedFormats.push('jpg') // fallback

    prioritizedFormats.forEach(format => {
      sizes.forEach(size => {
        // Generate URL with size and format parameters
        // This assumes your image service supports these parameters
        const url = `${src}?w=${size}&q=${imageQuality}&fmt=${format}`
        srcSetEntries.push(`${url} ${size}w`)
      })
    })

    // Generate sizes attribute for responsive images
    const sizesAttr = capabilities.isMobile
      ? '(max-width: 767px) 100vw'
      : capabilities.isTablet
      ? '(max-width: 1023px) 100vw'
      : '(min-width: 1024px) 100vw'

    return {
      src: `${src}?w=${closestSize}&q=${imageQuality}&fmt=${prioritizedFormats[0]}`,
      srcSet: srcSetEntries.join(', '),
      sizes: sizesAttr
    }
  }, [src, capabilities, sizes, formats, quality])

  return responsiveSources
}

// Avatar size optimization
export function useAvatarSize(baseSize = 40) {
  const capabilities = useDeviceCapabilities()

  const avatarSize = useMemo(() => {
    let size = baseSize

    // Adjust for pixel ratio
    size *= capabilities.pixelRatio

    // Reduce size on slower connections or limited memory
    if (capabilities.connection === 'slow-2g' || capabilities.connection === '2g') {
      size *= 0.8
    }

    // Ensure minimum size for usability
    return Math.max(size, capabilities.isMobile ? 32 : 24)
  }, [baseSize, capabilities])

  return avatarSize
}