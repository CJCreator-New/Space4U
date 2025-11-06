// Enhanced Animation Utilities for Space4U
import { useSpring, config } from 'react-spring';

// Therapeutic animation configs
export const therapeuticConfig = {
  gentle: { tension: 120, friction: 14 },
  calm: { tension: 80, friction: 20 },
  smooth: config.smooth,
  slow: config.slow,
};

// Framer Motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.2 }
};

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: { duration: 0.3 }
};

// React Spring hooks
export const useFadeIn = () => useSpring({
  from: { opacity: 0 },
  to: { opacity: 1 },
  config: therapeuticConfig.gentle
});

export const useSlideUp = () => useSpring({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0px)' },
  config: therapeuticConfig.gentle
});

export const useScaleIn = () => useSpring({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
  config: therapeuticConfig.calm
});

// Stagger animation helper
export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Card hover animation
export const cardHover = {
  whileHover: { 
    y: -4, 
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
  },
  transition: { duration: 0.2 }
};

// Button press animation
export const buttonPress = {
  whileTap: { scale: 0.98 },
  whileHover: { scale: 1.02 },
  transition: { duration: 0.1 }
};
