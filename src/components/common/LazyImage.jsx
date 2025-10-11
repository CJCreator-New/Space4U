import { useImageOptimization } from '../../hooks/useImageOptimization'

function LazyImage({ src, alt, placeholder, className = '', ...props }) {
  const { imageSrc, isLoading, error } = useImageOptimization(src, { 
    placeholder,
    lazy: true 
  })

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Failed to load</span>
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
      loading="lazy"
      {...props}
    />
  )
}

export default LazyImage
