import { useState, useEffect } from 'react'

export function useImageOptimization(src, options = {}) {
  const { placeholder = '', quality = 75, lazy = true } = options
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }
    
    img.onerror = () => {
      setError('Failed to load image')
      setIsLoading(false)
    }

    if (lazy && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            img.src = src
            observer.disconnect()
          }
        },
        { rootMargin: '50px' }
      )
      
      const element = document.createElement('div')
      observer.observe(element)
      
      return () => observer.disconnect()
    } else {
      img.src = src
    }
  }, [src, lazy])

  return { imageSrc, isLoading, error }
}
