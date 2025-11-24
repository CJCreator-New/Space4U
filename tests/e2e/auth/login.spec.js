import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should redirect to auth page when not logged in', async ({ page }) => {
        await expect(page).toHaveURL(/.*auth/)
    })

    test('should show login form', async ({ page }) => {
        await page.goto('/auth')

        await expect(page.locator('input[name="email"]')).toBeVisible()
        await expect(page.locator('input[name="password"]')).toBeVisible()
        await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('should show validation errors for invalid email', async ({ page }) => {
        await page.goto('/auth')

        await page.fill('input[name="email"]', 'invalid-email')
        await page.fill('input[name="password"]', 'password123')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=/invalid.*email/i')).toBeVisible()
    })

    test('should show error for short password', async ({ page }) => {
        await page.goto('/auth')

        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', '123')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=/password.*6/i')).toBeVisible()
    })

    test('should toggle between login and signup', async ({ page }) => {
        await page.goto('/auth')

        // Should start on login
        await expect(page.locator('text=/sign in/i')).toBeVisible()

        // Switch to signup
        await page.click('text=/sign up/i')
        await expect(page.locator('text=/create.*account/i')).toBeVisible()

        // Switch back to login
        await page.click('text=/sign in/i')
        await expect(page.locator('text=/welcome back/i')).toBeVisible()
    })

    test('should show password visibility toggle', async ({ page }) => {
        await page.goto('/auth')

        const passwordInput = page.locator('input[name="password"]')
        await expect(passwordInput).toHaveAttribute('type', 'password')

        // Click toggle
        await page.click('[aria-label*="password"]')
        await expect(passwordInput).toHaveAttribute('type', 'text')
    })
})

test.describe('Authenticated User Flow', () => {
    test.use({
        storageState: 'tests/e2e/fixtures/auth.json' // Pre-authenticated state
    })

    test('should access home page when authenticated', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveURL('/')
        await expect(page.locator('text=/welcome/i')).toBeVisible()
    })

    test('should show user navigation', async ({ page }) => {
        await page.goto('/')

        await expect(page.locator('nav')).toBeVisible()
        await expect(page.locator('a[href="/circles"]')).toBeVisible()
        await expect(page.locator('a[href="/insights"]')).toBeVisible()
        await expect(page.locator('a[href="/profile"]')).toBeVisible()
    })

    test('should logout successfully', async ({ page }) => {
        await page.goto('/')

        // Click profile/menu
        await page.click('[aria-label*="menu"]')

        // Click logout
        await page.click('text=/logout/i')

        // Should redirect to auth
        await expect(page).toHaveURL(/.*auth/)
    })
})
