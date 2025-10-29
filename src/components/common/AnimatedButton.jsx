import { motion } from 'framer-motion';
import { buttonPress } from '../../utils/animations';

export function AnimatedButton({ 
  children, 
  variant = 'primary',
  className = '',
  disabled = false,
  ...props 
}) {
  const baseClass = variant === 'primary' ? 'btn-primary' : '';
  
  return (
    <motion.button
      {...buttonPress}
      className={`${baseClass} ${className} touch-target`}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
