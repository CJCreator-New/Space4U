const { validateQuery, validateBody } = require('../middleware/validation')
const express = require('express')
const request = require('supertest')

describe('Validation Middleware', () => {
    let app

    beforeEach(() => {
        app = express()
        app.use(express.json())
    })

    describe('Query Validation', () => {
        it('should pass valid query parameters', async () => {
            app.get('/test',
                validateQuery({
                    page: { type: 'number', min: 1 },
                    limit: { type: 'number', min: 1, max: 100 }
                }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app).get('/test?page=1&limit=10')
            expect(response.status).toBe(200)
        })

        it('should reject invalid number type', async () => {
            app.get('/test',
                validateQuery({ page: { type: 'number' } }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app).get('/test?page=abc')
            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Validation failed')
            expect(response.body.details).toContain('page must be a number')
        })

        it('should validate min value', async () => {
            app.get('/test',
                validateQuery({ page: { type: 'number', min: 1 } }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app).get('/test?page=0')
            expect(response.status).toBe(400)
            expect(response.body.details).toContain('page must be at least 1')
        })

        it('should validate max value', async () => {
            app.get('/test',
                validateQuery({ limit: { type: 'number', max: 100 } }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app).get('/test?limit=200')
            expect(response.status).toBe(400)
            expect(response.body.details).toContain('limit must be at most 100')
        })

        it('should validate enum values', async () => {
            app.get('/test',
                validateQuery({ sort: { enum: ['asc', 'desc'] } }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app).get('/test?sort=invalid')
            expect(response.status).toBe(400)
            expect(response.body.details).toContain('sort must be one of: asc, desc')
        })

        it('should validate required fields', async () => {
            app.get('/test',
                validateQuery({ id: { required: true } }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app).get('/test')
            expect(response.status).toBe(400)
            expect(response.body.details).toContain('id is required')
        })
    })

    describe('Body Validation', () => {
        it('should pass valid body', async () => {
            app.post('/test',
                validateBody({
                    name: { type: 'string', required: true },
                    age: { type: 'number', min: 0 }
                }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app)
                .post('/test')
                .send({ name: 'John', age: 25 })

            expect(response.status).toBe(200)
        })

        it('should validate string length', async () => {
            app.post('/test',
                validateBody({
                    name: { type: 'string', minLength: 3, maxLength: 10 }
                }),
                (req, res) => res.json({ success: true })
            )

            let response = await request(app).post('/test').send({ name: 'ab' })
            expect(response.status).toBe(400)
            expect(response.body.details).toContain('name must be at least 3 characters')

            response = await request(app).post('/test').send({ name: 'verylongname' })
            expect(response.status).toBe(400)
            expect(response.body.details).toContain('name must be at most 10 characters')
        })

        it('should validate required fields', async () => {
            app.post('/test',
                validateBody({
                    email: { type: 'string', required: true }
                }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app).post('/test').send({})
            expect(response.status).toBe(400)
            expect(response.body.details).toContain('email is required')
        })

        it('should validate type', async () => {
            app.post('/test',
                validateBody({
                    age: { type: 'number' },
                    active: { type: 'boolean' }
                }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app)
                .post('/test')
                .send({ age: 'twenty', active: 'yes' })

            expect(response.status).toBe(400)
            expect(response.body.details.length).toBeGreaterThan(0)
        })

        it('should allow optional fields', async () => {
            app.post('/test',
                validateBody({
                    name: { type: 'string', required: true },
                    nickname: { type: 'string' }
                }),
                (req, res) => res.json({ success: true })
            )

            const response = await request(app)
                .post('/test')
                .send({ name: 'John' })

            expect(response.status).toBe(200)
        })
    })
})
