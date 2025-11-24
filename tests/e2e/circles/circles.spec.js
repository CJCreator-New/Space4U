import { test, expect } from '@playwright/test'

test.describe('Circles Page', () => {
    test.use({
        storageState: 'tests/e2e/fixtures/auth.json'
    })

    test.beforeEach(async ({ page }) => {
        await page.goto('/circles')
    })

    test('should display circles list', async ({ page }) => {
        await expect(page.locator('h1:has-text("Circles")')).toBeVisible()
        await expect(page.locator('[data-testid="circle-card"]').first()).toBeVisible()
    })

    test('should filter circles by category', async ({ page }) => {
        // Click category filter
        await page.click('text=/mental health/i')

        // Verify filtered results
        const circles = page.locator('[data-testid="circle-card"]')
        await expect(circles.first()).toBeVisible()

        // All visible circles should be mental health category
        const count = await circles.count()
        for (let i = 0; i < count; i++) {
            await expect(circles.nth(i).locator('text=/mental health/i')).toBeVisible()
        }
    })

    test('should search circles', async ({ page }) => {
        await page.fill('[placeholder*="search"]', 'anxiety')

        // Wait for search results
        await page.waitForTimeout(500)

        const circles = page.locator('[data-testid="circle-card"]')
        const count = await circles.count()

        // Verify results contain search term
        for (let i = 0; i < count; i++) {
            const text = await circles.nth(i).textContent()
            expect(text.toLowerCase()).toContain('anxiety')
        }
    })

    test('should join a circle', async ({ page }) => {
        // Find a circle to join
        const joinButton = page.locator('button:has-text("Join")').first()
        await joinButton.click()

        // Verify joined state
        await expect(page.locator('button:has-text("Joined")')).toBeVisible({ timeout: 5000 })
        await expect(page.locator('text=/successfully.*joined/i')).toBeVisible()
    })

    test('should view circle details', async ({ page }) => {
        // Click on a circle
        await page.locator('[data-testid="circle-card"]').first().click()

        // Should navigate to circle feed
        await expect(page).toHaveURL(/\/circles\/\d+/)

        // Verify circle details
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('text=/members/i')).toBeVisible()
        await expect(page.locator('text=/posts/i')).toBeVisible()
    })
})

test.describe('Create Circle', () => {
    test.use({
        storageState: 'tests/e2e/fixtures/auth.json'
    })

    test('should open create circle modal', async ({ page }) => {
        await page.goto('/circles')

        await page.click('button:has-text("Create Circle")')

        await expect(page.locator('text=/create.*circle/i')).toBeVisible()
        await expect(page.locator('input[name="name"]')).toBeVisible()
    })

    test('should create a new circle', async ({ page }) => {
        await page.goto('/circles')

        // Open modal
        await page.click('button:has-text("Create Circle")')

        // Fill form
        await page.fill('input[name="name"]', 'Test Circle')
        await page.fill('textarea[name="description"]', 'A test circle for E2E testing')
        await page.click('select[name="category"]')
        await page.click('option:has-text("Mental Health")')

        // Submit
        await page.click('button[type="submit"]:has-text("Create")')

        // Verify success
        await expect(page.locator('text=/circle.*created/i')).toBeVisible({ timeout: 5000 })
    })

    test('should validate circle name', async ({ page }) => {
        await page.goto('/circles')

        await page.click('button:has-text("Create Circle")')

        // Try to submit without name
        await page.click('button[type="submit"]:has-text("Create")')

        await expect(page.locator('text=/name.*required/i')).toBeVisible()
    })
})

test.describe('Circle Feed', () => {
    test.use({
        storageState: 'tests/e2e/fixtures/auth.json'
    })

    test('should display circle posts', async ({ page }) => {
        // Navigate to a specific circle
        await page.goto('/circles/1')

        await expect(page.locator('[data-testid="post"]').first()).toBeVisible()
    })

    test('should create a post in circle', async ({ page }) => {
        await page.goto('/circles/1')

        // Fill post form
        await page.fill('textarea[placeholder*="share"]', 'This is a test post')
        await page.click('button:has-text("Post")')

        // Verify post appears
        await expect(page.locator('text=/this is a test post/i')).toBeVisible({ timeout: 5000 })
    })

    test('should like a post', async ({ page }) => {
        await page.goto('/circles/1')

        const likeButton = page.locator('[aria-label*="like"]').first()
        const initialLikes = await likeButton.textContent()

        await likeButton.click()

        // Verify like count increased
        await expect(likeButton).not.toHaveText(initialLikes)
    })
})
