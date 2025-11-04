/**
 * Centralized Animation Configuration
 * Using Framer Motion for consistent animations across Space4U
 */

// Respect user's motion preferences
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Page Transitions
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const pageTransition = {
  duration: 0.3,
  ease: 'easeInOut'
}

// Card Animations
export const cardHover = {
  scale: 1.02,
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  transition: { duration: 0.2 }
}

export const cardTap = {
  scale: 0.98
}

// Button Animations
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
}

export const buttonTap = {
  scale: 0.95
}

// List Animations
export const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

// Modal Animations
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export const modalContent = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: { opacity: 0, scale: 0.8, y: 50 }
}

// Count Up Animation
export const countUpTransition = {
  duration: 1,
  ease: 'easeOut'
}

// Emoji Bounce
export const emojiBounce = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.5, ease: 'easeInOut' }
}

// Pulse Animation
export const pulse = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
}

// Glow Effect
export const glow = {
  boxShadow: [
    '0 0 5px rgba(102, 126, 234, 0.5)',
    '0 0 20px rgba(102, 126, 234, 0.8)',
    '0 0 5px rgba(102, 126, 234, 0.5)'
  ],
  transition: { duration: 2, repeat: Infinity }
}

// Slide Animations
export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

// Fade Animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
}

// Ripple Effect (for buttons)
export const ripple = {
  scale: [0, 2],
  opacity: [0.5, 0],
  transition: { duration: 0.6 }
}

// Chart Draw-in
export const chartDrawIn = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.5, ease: 'easeInOut' }
}

// Confetti Burst (for celebrations)
export const confettiBurst = {
  scale: [0, 1.5, 1],
  opacity: [0, 1, 0],
  transition: { duration: 1, ease: 'easeOut' }
}

// Typewriter Effect
export const typewriter = {
  hidden: { width: 0 },
  visible: { 
    width: '100%',
    transition: { duration: 1, ease: 'linear' }
  }
}

// Tooltip Animations
export const tooltip = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 5 },
  transition: { duration: 0.2 }
}

// Progress Bar
export const progressBar = {
  initial: { width: 0 },
  animate: (progress) => ({ 
    width: `${progress}%`,
    transition: { duration: 0.5, ease: 'easeOut' }
  })
}

// Shake Animation (for errors)
export const shake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.5 }
}

// Success Checkmark
export const checkmark = {
  pathLength: [0, 1],
  opacity: [0, 1],
  transition: { duration: 0.5, ease: 'easeInOut' }
}

// Loading Spinner
export const spinner = {
  rotate: 360,
  transition: { duration: 1, repeat: Infinity, ease: 'linear' }
}

// Elevation (for cards)
export const elevate = {
  y: -5,
  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  transition: { duration: 0.2 }
}

// Shine Effect
export const shine = {
  backgroundPosition: ['200% center', '-200% center'],
  transition: { duration: 2, ease: 'linear' }
}
