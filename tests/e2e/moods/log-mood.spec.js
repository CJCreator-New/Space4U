import { test, expect } from '@playwright/test'

test.describe('Mood Logging Flow', () => {
    test.use({
        storageState: 'tests/e2e/fixtures/auth.json'
    })

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should display mood tracker on home page', async ({ page }) => {
        await expect(page.locator('text=/how.*feeling/i')).toBeVisible()
        await expect(page.locator('[data-mood]').first()).toBeVisible()
    })

    test('should log mood successfully', async ({ page }) => {
        // Select mood
        await page.click('[data-mood="happy"]')

        // Add note
        await page.fill('[name="note"]', 'Feeling great today!')

        // Select tags
        await page.click('text=/work/i')
        await page.click('text=/exercise/i')

        // Submit
        await page.click('button:has-text("Save")')

        // Verify success message
        await expect(page.locator('text=/mood.*saved/i')).toBeVisible({ timeout: 5000 })
    })

    test('should show mood in timeline after logging', async ({ page }) => {
        // Log a mood
        await page.click('[data-mood="calm"]')
        await page.fill('[name="note"]', 'Peaceful morning')
        await page.click('button:has-text("Save")')

        // Wait for success
        await expect(page.locator('text=/mood.*saved/i')).toBeVisible()

        // Check timeline
        await expect(page.locator('text=/peaceful morning/i')).toBeVisible()
    })

    test('should prevent logging multiple moods in same day', async ({ page }) => {
        // Log first mood
        await page.click('[data-mood="happy"]')
        await page.click('button:has-text("Save")')
        await expect(page.locator('text=/mood.*saved/i')).toBeVisible()

        // Try to log another
        await page.click('[data-mood="sad"]')

        // Should show message about already logged
        await expect(page.locator('text=/already.*logged/i')).toBeVisible()
    })

    test('should validate note length', async ({ page }) => {
        await page.click('[data-mood="happy"]')

        // Try very long note
        const longNote = 'a'.repeat(501)
        await page.fill('[name="note"]', longNote)
        await page.click('button:has-text("Save")')

        // Should show validation error
        await expect(page.locator('text=/note.*long/i')).toBeVisible()
    })
})

test.describe('Mood History', () => {
    test.use({
        storageState: 'tests/e2e/fixtures/auth.json'
    })

    test('should display mood timeline', async ({ page }) => {
        await page.goto('/')

        await expect(page.locator('text=/mood.*timeline/i')).toBeVisible()
        await expect(page.locator('[data-testid="mood-entry"]').first()).toBeVisible()
    })

    test('should show mood trend chart', async ({ page }) => {
        await page.goto('/')

        // Scroll to trends section
        await page.locator('text=/mood.*trends/i').scrollIntoViewIfNeeded()

        await expect(page.locator('text=/mood.*trends/i')).toBeVisible()
        await expect(page.locator('canvas, svg').first()).toBeVisible()
    })

    test('should filter moods by date range', async ({ page }) => {
        await page.goto('/insights')

        // Open date picker
        await page.click('[aria-label*="date"]')

        // Select last 7 days
        await page.click('text=/last.*7.*days/i')

        // Verify filtered results
        await expect(page.locator('[data-testid="mood-entry"]')).toHaveCount(7, { timeout: 5000 })
    })
})
