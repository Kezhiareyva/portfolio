import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('home page redirects to a locale and shows the title screen', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveURL(/\/(en|id)$/)
    await expect(page).toHaveTitle(/Kezhia Reyva/)
    await expect(page.locator('h1').first()).toContainText('Kezhia Reyva')
  })

  test('language switch keeps the page working', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    await page.locator('a[hreflang="id"]').first().click()

    await expect(page).toHaveURL(/\/id/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'id')
  })
})
