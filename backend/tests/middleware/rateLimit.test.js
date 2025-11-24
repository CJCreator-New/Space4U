app.use(express.json())
    })

describe('Request Limiting', () => {
    it('should allow requests within limit', async () => {
        app.use(rateLimiter({ windowMs: 60000, max: 5 }))
        app.get('/test', (req, res) => res.json({ success: true }))

        for (let i = 0; i < 5; i++) {
            const response = await request(app).get('/test')
            expect(response.status).toBe(200)
        }
    })

    it('should block requests exceeding limit', async () => {
        app.use(rateLimiter({ windowMs: 60000, max: 3 }))
        app.get('/test', (req, res) => res.json({ success: true }))

        // Make 3 successful requests
        for (let i = 0; i < 3; i++) {
            await request(app).get('/test').expect(200)
        }

        // 4th request should be rate limited
        const response = await request(app).get('/test')
        expect(response.status).toBe(429)
        expect(response.body).toHaveProperty('error')
    })

    it('should include rate limit headers', async () => {
        app.use(rateLimiter({ windowMs: 60000, max: 10 }))
        app.get('/test', (req, res) => res.json({ success: true }))

        const response = await request(app).get('/test')

        expect(response.headers['x-ratelimit-limit']).toBe('10')
        expect(response.headers['x-ratelimit-remaining']).toBeDefined()
        expect(response.headers['x-ratelimit-reset']).toBeDefined()
    })

    it('should decrement remaining count', async () => {
        app.use(rateLimiter({ windowMs: 60000, max: 5 }))
        app.get('/test', (req, res) => res.json({ success: true }))

        const response1 = await request(app).get('/test')
        expect(response1.headers['x-ratelimit-remaining']).toBe('4')

        const response2 = await request(app).get('/test')
        expect(response2.headers['x-ratelimit-remaining']).toBe('3')
    })
})

describe('Window Reset', () => {
    it('should reset limit after window expires', async () => {
        app.use(rateLimiter({ windowMs: 1000, max: 2 }))
        app.get('/test', (req, res) => res.json({ success: true }))

        // Use up the limit
        await request(app).get('/test').expect(200)
        await request(app).get('/test').expect(200)
        await request(app).get('/test').expect(429)

        // Wait for window to reset
        await new Promise(resolve => setTimeout(resolve, 1100))

        // Should work again
        const response = await request(app).get('/test')
        expect(response.status).toBe(200)
    })
})

describe('Custom Error Message', () => {
    it('should use custom error message', async () => {
        app.use(rateLimiter({
            windowMs: 60000,
            max: 1,
            message: 'Custom rate limit message'
        }))
        app.get('/test', (req, res) => res.json({ success: true }))

        await request(app).get('/test')
        const response = await request(app).get('/test')

        expect(response.status).toBe(429)
        expect(response.body.error).toBe('Custom rate limit message')
    })
})

describe('Retry-After Header', () => {
    it('should include retry-after header when rate limited', async () => {
        app.use(rateLimiter({ windowMs: 60000, max: 1 }))
        app.get('/test', (req, res) => res.json({ success: true }))

        await request(app).get('/test')
        const response = await request(app).get('/test')

        expect(response.status).toBe(429)
        expect(response.headers['retry-after']).toBeDefined()
        expect(parseInt(response.headers['retry-after'])).toBeGreaterThan(0)
    })
})
})
