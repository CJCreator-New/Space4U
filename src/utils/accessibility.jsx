/**
 * Accessibility Utilities
 * Common utilities and hooks for improving accessibility across the application
 */

// Generate unique IDs for aria-describedby relationships
let idCounter = 0
export const generateId = (prefix = 'a11y') => {
    idCounter += 1
    return `${prefix}-${idCounter}-${Date.now()}`
}

// Announce message to screen readers
export const announce = (message, priority = 'polite') => {
    const liveRegion = document.querySelector(`[aria-live="${priority}"]`)
    if (liveRegion) {
        liveRegion.textContent = message
        setTimeout(() => {
            liveRegion.textContent = ''
        }, 1000)
    }
}

// Trap focus within a modal or dialog
export const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus()
                e.preventDefault()
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus()
                e.preventDefault()
            }
        }
    }

    element.addEventListener('keydown', handleTabKey)

    return () => {
        element.removeEventListener('keydown', handleTabKey)
    }
}

// Custom hook for managing focus
export const useFocusManagement = () => {
    const saveFocus = () => {
        return document.activeElement
    }

    const restoreFocus = (element) => {
        if (element && element.focus) {
            element.focus()
        }
    }

    return { saveFocus, restoreFocus }
}

// Skip to main content link helper
export const SkipLink = ({ targetId = 'main-content', children = 'Skip to main content' }) => {
    return (
        <a
            href={`#${targetId}`}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
            {children}
        </a>
    )
}

// Helper to ensure button has accessible name
export const ensureAccessibleButton = (iconOnly, label) => {
    if (iconOnly && !label) {
        console.warn('Icon-only button detected without aria-label')
    }
    return iconOnly ? { 'aria-label': label } : {}
}

// Keyboard navigation constants
export const KEYS = {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End'
}

// Check if element is interactive
export const isInteractive = (element) => {
    const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']
    return interactiveTags.includes(element.tagName) || element.hasAttribute('role')
}

// Get visible text content (for screen readers)
export const getVisibleText = (element) => {
    return element.textContent?.trim() || element.getAttribute('aria-label') || ''
}

// Color contrast checker (WCAG AA/AAA)
export const checkContrast = (foreground, background) => {
    const getLuminance = (hex) => {
        const rgb = parseInt(hex.slice(1), 16)
        const r = ((rgb >> 16) & 0xff) / 255
        const g = ((rgb >> 8) & 0xff) / 255
        const b = ((rgb >> 0) & 0xff) / 255
        const [rs, gs, bs] = [r, g, b].map(c =>
            c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        )
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    return {
        ratio: ratio.toFixed(2),
        passesAA: ratio >= 4.5,
        passesAAA: ratio >= 7
    }
}

// Accessible form field wrapper
export const FormField = ({ id, label, error, required, children, description }) => {
    const errorId = error ? `${id}-error` : undefined
    const descId = description ? `${id}-desc` : undefined
    const ariaDescribedBy = [descId, errorId].filter(Boolean).join(' ') || undefined

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </label>
            {description && (
                <p id={descId} className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            )}
            <div>
                {typeof children === 'function'
                    ? children({ id, 'aria-describedby': ariaDescribedBy, 'aria-invalid': !!error })
                    : children
                }
            </div>
            {error && (
                <p id={errorId} className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}

// Live region component for dynamic announcements
export const LiveRegion = ({ priority = 'polite', className = 'sr-only' }) => {
    return (
        <div
            aria-live={priority}
            aria-atomic="true"
            className={className}
            role="status"
        />
    )
}
