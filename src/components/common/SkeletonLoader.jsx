function SkeletonLoader({ variant = 'card', count = 1, className = '' }) {
  const variants = {
    card: 'h-32 rounded-xl',
    text: 'h-4 rounded',
    title: 'h-6 rounded w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-12 rounded-xl w-32',
    list: 'h-16 rounded-lg'
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${variants[variant]} ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

export default SkeletonLoader
