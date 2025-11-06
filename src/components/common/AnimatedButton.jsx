import { motion } from 'framer-motion'
import { buttonHover, buttonTap } from '../../config/animations'

function AnimatedButton({ children, className = '', onClick, disabled, ...props }) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? buttonHover : {}}
      whileTap={!disabled ? buttonTap : {}}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default AnimatedButton
