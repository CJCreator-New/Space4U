import { lazy, Suspense } from 'react'

/**
 * Lazy load a component with a custom loading fallback
 * @param {Function} importFunc - Dynamic import function
 * @param {React.Component} fallback - Loading component to show while loading
 * @returns {React.Component} - Wrapped lazy component
 */
export const lazyLoad = (importFunc, fallback = null) => {
    const LazyComponent = lazy(importFunc)

    return (props) => (
        <Suspense fallback={fallback}>
            <LazyComponent {...props} />
        </Suspense>
    )
}

/**
 * Lazy load with intersection observer - only loads when component is about to be visible
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Intersection observer options
 * @returns {React.Component} - Wrapped lazy component
 */
export const lazyLoadOnView = (importFunc, options = {}) => {
    const defaultOptions = {
        rootMargin: '50px',
        threshold: 0.01,
        ...options
    }

    return (props) => {
        const [shouldLoad, setShouldLoad] = React.useState(false)
        const ref = React.useRef(null)

        React.useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setShouldLoad(true)
                        observer.disconnect()
                    }
                },
                defaultOptions
            )

            if (ref.current) {
                observer.observe(ref.current)
            }

            return () => observer.disconnect()
        }, [])

        const LazyComponent = lazy(importFunc)

        return (
            <div ref={ref}>
                {shouldLoad ? (
                    <Suspense fallback={<div>Loading...</div>}>
                        <LazyComponent {...props} />
                    </Suspense>
                ) : (
                    <div style={{ minHeight: '200px' }} />
                )}
            </div>
        )
    }
}

/**
 * Preload a lazy component
 * @param {Function} importFunc - Dynamic import function
 */
export const preload = (importFunc) => {
    importFunc()
}

export default {
    lazyLoad,
    lazyLoadOnView,
    preload
}
