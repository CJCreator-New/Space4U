const request = require('supertest')
const express = require('express')
const { cacheMiddleware, clearCache } = require('../middleware/cache')

describe('Cache Middleware', () => {
    let app

    beforeEach(() => {
        app = express()
        app.use(express.json())
        clearCache()
    })

    afterEach(() => {
        clearCache()
    })

    describe('GET Request Caching', () => {
        it('should cache GET requests', async () => {
            let callCount = 0

            app.get('/test', cacheMiddleware(60), (req, res) => {
                callCount++
                res.json({ data: 'test', count: callCount })
            })

            // First request - cache miss
            const response1 = await request(app).get('/test')
            expect(response1.headers['x-cache']).toBe('MISS')
            expect(response1.body.count).toBe(1)

            // Second request - cache hit
            const response2 = await request(app).get('/test')
            expect(response2.headers['x-cache']).toBe('HIT')
            expect(response2.body.count).toBe(1) // Same data from cache
            expect(callCount).toBe(1) // Handler called only once
        })

        it('should include cache age header', async () => {
            app.get('/test', cacheMiddleware(60), (req, res) => {
                res.json({ data: 'test' })
            })

            await request(app).get('/test')

            // Wait a bit
            await new Promise(resolve => setTimeout(resolve, 100))

            const response = await request(app).get('/test')
            expect(response.headers['x-cache-age']).toBeDefined()
            expect(parseInt(response.headers['x-cache-age'])).toBeGreaterThan(0)
        })

        it('should expire cache after duration', async () => {
            let callCount = 0

            app.get('/test', cacheMiddleware(1), (req, res) => {
                callCount++
                res.json({ count: callCount })
            })

            // First request
            await request(app).get('/test')
            expect(callCount).toBe(1)

            // Wait for cache to expire
            await new Promise(resolve => setTimeout(resolve, 1100))

            // Second request after expiry
            const response = await request(app).get('/test')
            expect(response.headers['x-cache']).toBe('MISS')
            expect(callCount).toBe(2)
        })
    })

    describe('Non-GET Requests', () => {
        it('should not cache POST requests', async () => {
            let callCount = 0

            app.post('/test', cacheMiddleware(60), (req, res) => {
                callCount++
                res.json({ count: callCount })
            })

            await request(app).post('/test').send({})
            await request(app).post('/test').send({})

            expect(callCount).toBe(2) // Both requests hit the handler
        })

        it('should not cache PUT requests', async () => {
            let callCount = 0

            app.put('/test', cacheMiddleware(60), (req, res) => {
                callCount++
                res.json({ count: callCount })
            })

            await request(app).put('/test').send({})
            await request(app).put('/test').send({})

            expect(callCount).toBe(2)
        })
    })

    describe('Cache Key Generation', () => {
        it('should use different cache keys for different URLs', async () => {
            app.get('/test1', cacheMiddleware(60), (req, res) => {
                res.json({ endpoint: 'test1' })
            })

            app.get('/test2', cacheMiddleware(60), (req, res) => {
                res.json({ endpoint: 'test2' })
            })

            const response1 = await request(app).get('/test1')
            const response2 = await request(app).get('/test2')

            expect(response1.body.endpoint).toBe('test1')
            expect(response2.body.endpoint).toBe('test2')
        })

        it('should use different cache keys for different query params', async () => {
            let callCount = 0

            app.get('/test', cacheMiddleware(60), (req, res) => {
                callCount++
                res.json({ query: req.query, count: callCount })
            })

            await request(app).get('/test?page=1')
            await request(app).get('/test?page=2')

            expect(callCount).toBe(2) // Different query params = different cache keys
        })
    })
})
