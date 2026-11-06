import { test, expect } from '@playwright/test'

const EMAIL = process.env.TEST_USER_EMAIL ?? ''
const PASSWORD = process.env.TEST_USER_PASSWORD ?? ''

test.describe('Dashboard', () => {
    test.skip(!EMAIL || !PASSWORD, 'Set TEST_USER_EMAIL and TEST_USER_PASSWORD for a test account.')

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth')
        await page.getByPlaceholder('you@example.com').fill(EMAIL)
        await page.getByPlaceholder('••••••••').first().fill(PASSWORD)
        await page.locator('form').getByRole('button', { name: 'Sign in' }).click()
        await page.waitForURL('/dashboard')
        await page.waitForLoadState('networkidle')
    })

    test('shows all four tabs', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Content' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Style' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Analytics' })).toBeVisible()
    })

    test('can switch to Profile tab', async ({ page }) => {
        await page.getByRole('button', { name: 'Profile' }).first().click({ force: true })
        await page.waitForTimeout(1000)
        await expect(page.getByText('Display name')).toBeVisible({ timeout: 10000 })
    })

    test('can switch to Style tab', async ({ page }) => {
        await page.getByRole('button', { name: 'Style' }).first().click({ force: true })
        await page.waitForTimeout(1000)
        await expect(page.getByText('Font')).toBeVisible({ timeout: 10000 })
    })

    test('can switch to Analytics tab', async ({ page }) => {
        await page.getByRole('button', { name: 'Analytics' }).first().click({ force: true })
        await page.waitForTimeout(1000)
        await expect(page.getByText('Last 30 days')).toBeVisible({ timeout: 10000 })
    })

    test('keeps the selected tab after a refresh', async ({ page }) => {
        const style = page.getByRole('button', { name: 'Style', exact: true })
        await style.click()
        await expect(page).toHaveURL(/\/dashboard\?tab=style$/)

        await page.reload()

        await expect(style).toHaveAttribute('aria-pressed', 'true')
        await expect(page.getByText('Font', { exact: true })).toBeVisible()
    })
})
