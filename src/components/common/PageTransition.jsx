import { usePageTransition } from '../../hooks/usePageTransition'

function PageTransition({ children }) {
  const { isTransitioning } = usePageTransition()

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
    </div>
  )
}

export default PageTransition
