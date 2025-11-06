import { motion } from 'framer-motion';

// Wrapper for consistent icon styling and animations
export function Icon({ 
  icon: IconComponent, 
  size = 20, 
  color, 
  animate = false,
  ...props 
}) {
  const iconProps = {
    size,
    color,
    strokeWidth: 2,
    ...props
  };

  if (animate) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'inline-flex' }}
      >
        <IconComponent {...iconProps} />
      </motion.div>
    );
  }

  return <IconComponent {...iconProps} />;
}
