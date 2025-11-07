// Unified icon library using Lucide React only
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

export function Icon({ 
  name,
  library = 'lucide',
  size = 20,
  color,
  animate = false,
  className = '',
  ...props 
}) {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  const iconProps = {
    size,
    color,
    strokeWidth: 2,
    className,
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

// Convenience exports for common icons
export const Icons = {
  Heart: (props) => <Icon name="Heart" {...props} />,
  Star: (props) => <Icon name="Star" {...props} />,
  Smile: (props) => <Icon name="Smile" {...props} />,
  TrendingUp: (props) => <Icon name="TrendingUp" {...props} />,
  Check: (props) => <Icon name="Check" {...props} />,
  X: (props) => <Icon name="X" {...props} />,
};
