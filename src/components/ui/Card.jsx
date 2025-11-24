import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * Reusable Card component with multiple variants and animations
 */
const Card = ({
    children,
    variant = 'elevated',
    padding = 'md',
    hover = true,
    onClick,
    className = '',
    ...props
}) => {
    const baseStyles = 'rounded-2xl transition-all duration-300'

    const variants = {
        elevated: 'bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700',
        flat: 'bg-white dark:bg-gray-800',
        outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
        glassmorphic: 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20 shadow-xl'
    }

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
    }

    const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''

    const cardClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ')

    const MotionCard = onClick ? motion.div : 'div'
    const motionProps = onClick ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 }
    } : {}

    return (
        <MotionCard
            className={cardClasses}
            onClick={onClick}
            {...motionProps}
            {...props}
        >
            {children}
        </MotionCard>
    )
}

Card.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['elevated', 'flat', 'outlined', 'glassmorphic']),
    padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
    hover: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string
}

export default Card
