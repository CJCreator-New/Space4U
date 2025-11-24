/**
 * Rate limiting middleware for Express
 */

/**
 * Rate limiter middleware factory
 * @param {Object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests per window
 * @param {string} options.message - Error message when limit is exceeded
 * @returns {Function} Express middleware
 */
const rateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // 100 requests per window
        message = 'Too many requests, please try again later.',
        keyGenerator = (req) => req.ip || req.connection.remoteAddress,
    } = options;

    // Store per middleware instance to isolate tests
    const rateLimitStore = new Map();

    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();
        const currentWindowStart = now - (now % windowMs);

        // Retrieve or initialize record for this key
        let record = rateLimitStore.get(key);
        if (!record || record.windowStart !== currentWindowStart) {
            // New window or first request
            record = { count: 0, windowStart: currentWindowStart };
            rateLimitStore.set(key, record);
        }

        // Increment request count
        record.count++;

        // Set rate limit headers
        res.set('X-RateLimit-Limit', max.toString());
        const remaining = Math.max(0, max - record.count);
        res.set('X-RateLimit-Remaining', remaining.toString());
        const resetTime = new Date(currentWindowStart + windowMs).toISOString();
        res.set('X-RateLimit-Reset', resetTime);

        // Check if limit exceeded
        if (record.count > max) {
            const retryAfterSec = Math.ceil((currentWindowStart + windowMs - now) / 1000);
            res.set('Retry-After', retryAfterSec.toString());
            return res.status(429).json({
                error: message,
                retryAfter: retryAfterSec,
            });
        }

        next();
    };
};

/**
 * Clean up expired rate limit records (optional)
 */
const cleanupRateLimitStore = () => {
    // No global store to clean; each middleware instance manages its own store.
};

module.exports = {
    rateLimiter,
    cleanupRateLimitStore,
};
