/**
 * Request logging middleware
 */

const fs = require('fs')
const path = require('path')

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
}

/**
 * Format log entry
 */
const formatLogEntry = (req, res, duration) => {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        cached: res.get('X-Cache') || 'N/A'
    })
}

/**
 * Write log to file
 */
const writeLog = (logEntry) => {
    const date = new Date().toISOString().split('T')[0]
    const logFile = path.join(logsDir, `${date}.log`)

    fs.appendFile(logFile, logEntry + '\n', (err) => {
        if (err) console.error('Error writing log:', err)
    })
}

/**
 * Request logger middleware
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now()

    // Store original end function
    const originalEnd = res.end

    // Override end function to log after response
    res.end = function (...args) {
        const duration = Date.now() - startTime
        const logEntry = formatLogEntry(req, res, duration)

        // Log to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.log(logEntry)
        }

        // Write to file
        writeLog(logEntry)

        // Call original end function
        originalEnd.apply(res, args)
    }

    next()
}

/**
 * Get log statistics
 */
const getLogStats = () => {
    const date = new Date().toISOString().split('T')[0]
    const logFile = path.join(logsDir, `${date}.log`)

    if (!fs.existsSync(logFile)) {
        return { requests: 0, errors: 0, avgDuration: 0 }
    }

    const logs = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean)
    const parsedLogs = logs.map(log => JSON.parse(log))

    const requests = parsedLogs.length
    const errors = parsedLogs.filter(log => log.status >= 400).length
    const durations = parsedLogs.map(log => parseInt(log.duration))
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length

    return {
        requests,
        errors,
        avgDuration: Math.round(avgDuration),
        errorRate: ((errors / requests) * 100).toFixed(2) + '%'
    }
}

module.exports = {
    requestLogger,
    getLogStats
}
