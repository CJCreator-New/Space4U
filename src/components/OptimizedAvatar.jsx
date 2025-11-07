import { useMemo } from 'react'
import { useAvatarSize } from '../hooks/useResponsiveImage'

function OptimizedAvatar({
  src,
  alt = 'Avatar',
  fallback = '👤',
  size: baseSize = 40,
  className = '',
  ...props
}) {
  const avatarSize = useAvatarSize(baseSize)

  const avatarStyle = useMemo(() => ({
    width: `${avatarSize}px`,
    height: `${avatarSize}px`,
    minWidth: `${avatarSize}px`,
    minHeight: `${avatarSize}px`
  }), [avatarSize])

  // If no image source, use emoji fallback
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-2xl font-medium ${className}`}
        style={avatarStyle}
        role="img"
        aria-label={alt}
        {...props}
      >
        {fallback}
      </div>
    )
  }

  // Use optimized image for actual avatars
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm ${className}`}
      style={avatarStyle}
      loading="lazy"
      {...props}
    />
  )
}

export default OptimizedAvatar