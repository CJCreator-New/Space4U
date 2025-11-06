import { motion } from 'framer-motion'
import Icon from '../Icon'

function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="mx-auto mb-2"
        >
          <Icon name="Loader2" library="lucide" size={32} color="#6366F1" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary dark:text-gray-300"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  )
}

export default PageLoader
