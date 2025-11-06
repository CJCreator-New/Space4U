import { motion } from 'framer-motion'
import Shimmer from './Shimmer'

function EmptyState({ icon, title, description, action, actionLabel, showPreview = false, previewType = 'card' }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  const renderPreview = () => {
    if (!showPreview) return null

    switch (previewType) {
      case 'mood':
        return (
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 bg-gray-50 rounded-xl max-w-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <Shimmer width="40px" height="40px" borderRadius="50%" />
              <div>
                <Shimmer width="80px" height="16px" className="mb-1" />
                <Shimmer width="60px" height="12px" />
              </div>
            </div>
            <Shimmer width="100%" height="60px" borderRadius="12px" />
          </motion.div>
        )
      case 'post':
        return (
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 bg-gray-50 rounded-xl max-w-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <Shimmer width="32px" height="32px" borderRadius="50%" />
              <div>
                <Shimmer width="100px" height="14px" className="mb-1" />
                <Shimmer width="60px" height="12px" />
              </div>
            </div>
            <Shimmer lines={2} className="mb-3" />
            <div className="flex gap-2">
              <Shimmer width="50px" height="24px" borderRadius="12px" />
              <Shimmer width="70px" height="24px" borderRadius="12px" />
            </div>
          </motion.div>
        )
      case 'habit':
        return (
          <motion.div
            variants={itemVariants}
            className="mt-6 space-y-3 max-w-sm"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Shimmer width="24px" height="24px" borderRadius="6px" />
                <div className="flex-1">
                  <Shimmer width="120px" height="16px" className="mb-1" />
                  <Shimmer width="80px" height="12px" />
                </div>
                <Shimmer width="40px" height="20px" borderRadius="10px" />
              </div>
            ))}
          </motion.div>
        )
      default:
        return (
          <motion.div
            variants={itemVariants}
            className="mt-6 p-6 bg-gray-50 rounded-xl max-w-sm"
          >
            <Shimmer width="100%" height="20px" className="mb-3" />
            <Shimmer width="80%" height="20px" className="mb-3" />
            <Shimmer width="60%" height="20px" />
          </motion.div>
        )
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        variants={itemVariants}
        className="text-6xl mb-4"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        {icon || '📭'}
      </motion.div>
      
      <motion.h3
        variants={itemVariants}
        className="text-xl font-semibold text-text-primary dark:text-white mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        variants={itemVariants}
        className="text-text-secondary dark:text-gray-300 mb-6 max-w-sm"
      >
        {description}
      </motion.p>

      {renderPreview()}

      {action && (
        <motion.button
          variants={itemVariants}
          onClick={action}
          className="btn-primary mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionLabel || 'Get Started'}
        </motion.button>
      )}
    </motion.div>
  )
}

export default EmptyState
