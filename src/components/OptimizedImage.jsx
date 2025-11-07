import { useState, useEffect, useRef } from 'react'
import { useResponsiveImage } from '../hooks/useResponsiveImage'

function OptimizedImage({
  src,
  alt,
  className = '',
  placeholder = 'blur',
  loading = 'lazy',
  responsive = true,
  sizes = [320, 640, 1024, 1280, 1920],
  formats = ['webp', 'avif', 'jpg'],
  quality = { mobile: 75, tablet: 80, desktop: 85 },
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)

  // Get responsive image sources
  const responsiveSources = useResponsiveImage(src, {
    sizes,
    formats,
    quality
  })

  useEffect(() => {
    if (!imgRef.current || loading !== 'lazy') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [loading])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={responsive ? responsiveSources.src : src}
          srcSet={responsive ? responsiveSources.srcSet : undefined}
          sizes={responsive ? responsiveSources.sizes : undefined}
          alt={alt}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full object-cover`}
          loading={loading}
          {...props}
        />
      )}
    </div>
  )
}

export default OptimizedImage
