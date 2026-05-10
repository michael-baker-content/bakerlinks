import { test, expect } from '@playwright/test'

const EMAIL = 'test@bakerlinks.com'
const PASSWORD = 'suukr@F)6)orT%R-kqp*'

test.describe('Auth', () => {
    test('signs in with email and password', async ({ page }) => {
        await page.goto('/auth')
        await page.getByPlaceholder('you@example.com').fill(EMAIL)
        await page.getByPlaceholder('••••••••').first().fill(PASSWORD)
        await page.locator('form').getByRole('button', { name: 'Sign in' }).click()
        await expect(page).toHaveURL('/dashboard')
    })

    test('shows error for wrong password', async ({ page }) => {
        await page.goto('/auth')
        await page.getByPlaceholder('you@example.com').fill(EMAIL)
        await page.getByPlaceholder('••••••••').first().fill('wrongpassword')
        await page.locator('form').getByRole('button', { name: 'Sign in' }).click()
        await expect(page.getByText(/invalid/i)).toBeVisible()
    })

    test('signs out', async ({ page }) => {
        await page.goto('/auth')
        await page.getByPlaceholder('you@example.com').fill(EMAIL)
        await page.getByPlaceholder('••••••••').first().fill(PASSWORD)
        await page.locator('form').getByRole('button', { name: 'Sign in' }).click()
        await page.waitForURL('/dashboard')
        await page.waitForLoadState('networkidle')
        await page.locator('header').getByRole('button', { name: 'Sign out' }).click({ force: true })
        await page.waitForURL('/')
    })
})