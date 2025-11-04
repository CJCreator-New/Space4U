import { motion } from 'framer-motion'

const Shimmer = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = '',
  lines = 1,
  gap = '8px'
}) => {
  const shimmerVariants = {
    shimmer: {
      backgroundPosition: ['-200% 0', '200% 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  if (lines === 1) {
    return (
      <motion.div
        variants={shimmerVariants}
        animate="shimmer"
        className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${className}`}
        style={{
          width,
          height,
          borderRadius
        }}
      />
    )
  }

  return (
    <div className="space-y-2" style={{ gap }}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          variants={shimmerVariants}
          animate="shimmer"
          className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${className}`}
          style={{
            width: index === lines - 1 ? '60%' : width, // Last line shorter
            height,
            borderRadius
          }}
        />
      ))}
    </div>
  )
}

export default Shimmer