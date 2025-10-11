function Skeleton({ variant = 'text', width = '100%', height, className = '' }) {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'h-32 rounded-xl'
  }

  return (
    <div
      className={`skeleton ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

export default Skeleton
