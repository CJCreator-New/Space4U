/**
 * Simple in-memory cache middleware for Express
 */

const cache = new Map()

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (duration = 300) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next()
        }

        const key = req.originalUrl || req.url
        const cachedResponse = cache.get(key)

        if (cachedResponse) {
            const { timestamp, data, headers } = cachedResponse
            const age = (Date.now() - timestamp) / 1000

            // Check if cache is still valid
            if (age < duration) {
                // Set cache headers
                res.set('X-Cache', 'HIT')
                res.set('X-Cache-Age', Math.floor(age).toString())

                // Restore cached headers
                Object.entries(headers).forEach(([key, value]) => {
                    res.set(key, value)
                })

                return res.json(data)
            } else {
                // Cache expired, remove it
                cache.delete(key)
            }
        }

        // Store original json method
        const originalJson = res.json.bind(res)

        // Override json method to cache the response
        res.json = function (data) {
            // Cache the response
            cache.set(key, {
                timestamp: Date.now(),
                data,
                headers: {
                    'Content-Type': res.get('Content-Type') || 'application/json'
                }
            })

            // Set cache headers
            res.set('X-Cache', 'MISS')
            res.set('Cache-Control', `public, max-age=${duration}`)

            // Call original json method
            return originalJson(data)
        }

        next()
    }
}

/**
 * Clear cache for a specific key or all cache
 * @param {string} key - Optional cache key to clear
 */
const clearCache = (key = null) => {
    if (key) {
        cache.delete(key)
    } else {
        cache.clear()
    }
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
const getCacheStats = () => {
    return {
        size: cache.size,
        keys: Array.from(cache.keys())
    }
}

module.exports = {
    cacheMiddleware,
    clearCache,
    getCacheStats
}
