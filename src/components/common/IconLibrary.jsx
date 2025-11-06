// Unified icon library supporting Lucide and Heroicons
import * as LucideIcons from 'lucide-react';
import * as HeroIconsSolid from '@heroicons/react/24/solid';
import * as HeroIconsOutline from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export function Icon({ 
  name,
  library = 'lucide', // 'lucide', 'hero-solid', 'hero-outline'
  size = 20,
  color,
  animate = false,
  className = '',
  ...props 
}) {
  let IconComponent;

  // Select icon from library
  if (library === 'lucide') {
    IconComponent = LucideIcons[name];
  } else if (library === 'hero-solid') {
    IconComponent = HeroIconsSolid[name];
  } else if (library === 'hero-outline') {
    IconComponent = HeroIconsOutline[name];
  }

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in ${library}`);
    return null;
  }

  const iconProps = {
    size: library === 'lucide' ? size : undefined,
    width: library.startsWith('hero') ? size : undefined,
    height: library.startsWith('hero') ? size : undefined,
    color,
    strokeWidth: library === 'lucide' ? 2 : undefined,
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
  // Lucide
  Heart: (props) => <Icon name="Heart" library="lucide" {...props} />,
  Star: (props) => <Icon name="Star" library="lucide" {...props} />,
  Smile: (props) => <Icon name="Smile" library="lucide" {...props} />,
  TrendingUp: (props) => <Icon name="TrendingUp" library="lucide" {...props} />,
  
  // Heroicons Solid
  HeartSolid: (props) => <Icon name="HeartIcon" library="hero-solid" {...props} />,
  StarSolid: (props) => <Icon name="StarIcon" library="hero-solid" {...props} />,
  
  // Heroicons Outline
  HeartOutline: (props) => <Icon name="HeartIcon" library="hero-outline" {...props} />,
  StarOutline: (props) => <Icon name="StarIcon" library="hero-outline" {...props} />
};
