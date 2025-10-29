import { motion } from 'framer-motion';
import { fadeInUp, cardHover } from '../../utils/animations';

export function AnimatedCard({ 
  children, 
  delay = 0, 
  hover = true,
  className = '',
  ...props 
}) {
  return (
    <motion.div
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay }}
      {...(hover ? cardHover : {})}
      className={`card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
