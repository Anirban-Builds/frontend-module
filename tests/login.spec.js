import 'dotenv/config'
import { test, expect } from '@playwright/test'

test('user can login successfully', async ({ page, context }) => {
    await context.clearCookies()

    page.on('response', r => {
        if (r.url().includes('login')) {
            console.log('LOGIN STATUS:', r.status())
        }
    })

    await page.goto('http://localhost:5173')

    await page.getByTestId("ham-menu-btn").click()
    await page.getByTestId("login-btn").click()

    await expect(page).toHaveURL(/login/)

    await page.getByTestId("username-email-input").fill(process.env.TEST_USERNAME)
    await page.getByTestId("username-pass-input").fill(process.env.TEST_PASSWORD)

    await page.getByTestId("submit-login-btn").click()

    await expect(
        page.locator('a.account', { hasText: process.env.TEST_USERNAME })
    ).toBeVisible({ timeout: 10000 })
})