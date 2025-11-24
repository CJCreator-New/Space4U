/**
 * Request validation middleware
 */

/**
 * Validate query parameters
 * @param {Object} schema - Validation schema
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
        const errors = []

        for (const [key, rules] of Object.entries(schema)) {
            const value = req.query[key]

            // Required check
            if (rules.required && !value) {
                errors.push(`${key} is required`)
                continue
            }

            // Skip validation if value is not provided and not required
            if (!value) continue

            // Type validation
            if (rules.type === 'number') {
                const num = Number(value)
                if (isNaN(num)) {
                    errors.push(`${key} must be a number`)
                    continue
                }

                // Min/Max validation
                if (rules.min !== undefined && num < rules.min) {
                    errors.push(`${key} must be at least ${rules.min}`)
                }
                if (rules.max !== undefined && num > rules.max) {
                    errors.push(`${key} must be at most ${rules.max}`)
                }
            }

            // Enum validation
            if (rules.enum && !rules.enum.includes(value)) {
                errors.push(`${key} must be one of: ${rules.enum.join(', ')}`)
            }

            // Pattern validation
            if (rules.pattern && !rules.pattern.test(value)) {
                errors.push(`${key} has invalid format`)
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            })
        }

        next()
    }
}

/**
 * Validate request body
 * @param {Object} schema - Validation schema
 * @returns {Function} Express middleware
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const errors = []

        for (const [key, rules] of Object.entries(schema)) {
            const value = req.body[key]

            // Required check
            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push(`${key} is required`)
                continue
            }

            // Skip validation if value is not provided and not required
            if (value === undefined || value === null) continue

            // Type validation
            if (rules.type) {
                const actualType = Array.isArray(value) ? 'array' : typeof value
                if (actualType !== rules.type) {
                    errors.push(`${key} must be of type ${rules.type}`)
                    continue
                }
            }

            // String validations
            if (typeof value === 'string') {
                if (rules.minLength && value.length < rules.minLength) {
                    errors.push(`${key} must be at least ${rules.minLength} characters`)
                }
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors.push(`${key} must be at most ${rules.maxLength} characters`)
                }
                if (rules.pattern && !rules.pattern.test(value)) {
                    errors.push(`${key} has invalid format`)
                }
            }

            // Number validations
            if (typeof value === 'number') {
                if (rules.min !== undefined && value < rules.min) {
                    errors.push(`${key} must be at least ${rules.min}`)
                }
                if (rules.max !== undefined && value > rules.max) {
                    errors.push(`${key} must be at most ${rules.max}`)
                }
            }

            // Enum validation
            if (rules.enum && !rules.enum.includes(value)) {
                errors.push(`${key} must be one of: ${rules.enum.join(', ')}`)
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            })
        }

        next()
    }
}

module.exports = {
    validateQuery,
    validateBody
}
