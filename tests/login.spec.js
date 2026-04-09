import 'dotenv/config'
import { test, expect } from '@playwright/test'

test('user can login successfully', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto(process.env.VITE_GIT_URL)

    await page.getByTestId("ham-menu-btn").click()
    await page.getByTestId("login-btn").click()

    await expect(page).toHaveURL(/login/)

    await page.getByTestId("username-email-input").fill(process.env.TEST_USERNAME)
    await page.getByTestId("username-pass-input").fill(process.env.TEST_PASSWORD)

    await page.getByTestId("submit-login-btn").click()

    await expect(
        page.locator('a.account', { hasText: process.env.TEST_USERNAME })
    ).toBeVisible()
})