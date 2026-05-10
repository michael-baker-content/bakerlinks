import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('loads correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/BakerLinks/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Sign in link goes to auth page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/auth')
  })

  test('Get started link goes to signup', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Create your page' }).click()
    await expect(page).toHaveURL(/mode=signup/)
  })
})
