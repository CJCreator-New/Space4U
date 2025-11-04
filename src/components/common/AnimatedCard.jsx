import { motion } from 'framer-motion'
import { cardHover, cardTap } from '../../config/animations'

function AnimatedCard({ children, className = '', onClick, ...props }) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={cardHover}
      whileTap={onClick ? cardTap : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard
