const request = require('supertest')
const express = require('express')

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => Promise.resolve({
                    data: [
                        { id: 1, name: 'Test Circle', category: 'mental-health', members: 100 },
                        { id: 2, name: 'Support Group', category: 'support', members: 50 }
                    ],
                    error: null
                })),
                range: jest.fn(() => Promise.resolve({
                    data: [],
                    error: null,
                    count: 0
                }))
            }))
        }))
    }))
}))

describe('Circles API', () => {
    let app

    beforeAll(() => {
        // Import app after mocking
        app = require('../express-server')
    })

    describe('GET /api/circles', () => {
        it('should return list of circles', async () => {
            const response = await request(app)
                .get('/api/circles')
                .expect(200)

            expect(response.body).toHaveProperty('data')
            expect(Array.isArray(response.body.data)).toBe(true)
        })

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/circles?page=1&limit=10')
                .expect(200)

            expect(response.body.data.length).toBeLessThanOrEqual(10)
        })

        it('should filter by category', async () => {
            const response = await request(app)
                .get('/api/circles?category=mental-health')
                .expect(200)

            expect(response.body.data).toBeDefined()
        })

        it('should support search', async () => {
            const response = await request(app)
                .get('/api/circles?search=anxiety')
                .expect(200)

            expect(response.body.data).toBeDefined()
        })

        it('should support sorting', async () => {
            const response = await request(app)
                .get('/api/circles?sort=members')
                .expect(200)

            expect(response.body.data).toBeDefined()
        })

        it('should return 400 for invalid pagination', async () => {
            await request(app)
                .get('/api/circles?page=-1')
                .expect(400)
        })

        it('should include cache headers', async () => {
            const response = await request(app)
                .get('/api/circles')
                .expect(200)

            expect(response.headers['x-cache']).toBeDefined()
        })
    })

    describe('GET /api/circles/:id', () => {
        it('should return circle details', async () => {
            const response = await request(app)
                .get('/api/circles/1')
                .expect(200)

            expect(response.body).toHaveProperty('id')
            expect(response.body).toHaveProperty('name')
        })

        it('should return 404 for non-existent circle', async () => {
            await request(app)
                .get('/api/circles/99999')
                .expect(404)
        })
    })

    describe('POST /api/circles', () => {
        it('should create a new circle', async () => {
            const newCircle = {
                name: 'New Circle',
                description: 'Test description',
                category: 'mental-health',
                visibility: 'public'
            }

            const response = await request(app)
                .post('/api/circles')
                .send(newCircle)
                .expect(201)

            expect(response.body).toHaveProperty('circle')
            expect(response.body.circle.name).toBe(newCircle.name)
        })

        it('should validate required fields', async () => {
            await request(app)
                .post('/api/circles')
                .send({})
                .expect(400)
        })

        it('should validate circle name length', async () => {
            await request(app)
                .post('/api/circles')
                .send({ name: 'ab' })
                .expect(400)
        })
    })

    describe('POST /api/circles/:id/join', () => {
        it('should join a circle', async () => {
            const response = await request(app)
                .post('/api/circles/1/join')
                .send({ userId: 'user-123' })
                .expect(200)

            expect(response.body).toHaveProperty('success', true)
        })

        it('should prevent duplicate joins', async () => {
            await request(app)
                .post('/api/circles/1/join')
                .send({ userId: 'user-123' })
                .expect(200)

            await request(app)
                .post('/api/circles/1/join')
                .send({ userId: 'user-123' })
                .expect(409)
        })
    })
})
