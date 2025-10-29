import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { usePageTransition } from '../../hooks/usePageTransition'

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  out: {
    opacity: 0,
    scale: 1.02,
    y: -20
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

function PageTransition({ children }) {
  const location = useLocation()
  const { isTransitioning } = usePageTransition()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={`w-full h-full ${isTransitioning ? 'animate__animated animate__fadeIn' : ''}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
