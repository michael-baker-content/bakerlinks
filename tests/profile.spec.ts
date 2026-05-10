import { test, expect } from '@playwright/test'

const USERNAME = 'testuser'

test.describe('Public profile', () => {
    test('loads public profile page', async ({ page }) => {
        await page.goto(`/${USERNAME}`)
        await expect(page.getByText('testuser', { exact: false })).toBeVisible()
        await expect(page.getByText(`@${USERNAME}`)).toBeVisible()
    })

    test('shows powered by footer', async ({ page }) => {
        await page.goto(`/${USERNAME}`)
        await expect(page.getByText('BakerLinks').last()).toBeVisible()
    })

    test('returns 404 for unknown username', async ({ page }) => {
        await page.goto('/this-user-does-not-exist-xyz')
        await expect(page.getByText('404')).toBeVisible()
    })
})
