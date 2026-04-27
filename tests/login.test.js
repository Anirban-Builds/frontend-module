import 'dotenv/config'
import { test, expect } from '@playwright/test'

test('user can login successfully', async ({ page, context }) => {
    await context.clearCookies()

    await page.route('**/api/v1/users/login', async route => {
    const body = route.request().postDataJSON()

    if (body.password === process.env.TEST_PASSWORD) {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            statusCode: 200,
            data: {
                coverimage: null,
                username: process.env.TEST_USERNAME,
                email: "test@test.com",
                userExists: true,
                oldUser: true,
                firstload: true,
                masteruser: false,
                ghEmail: null,
                usertype: [true, false],
                avatar: null,
                repolist: []
            },
            message: "User logged In Successfully",
            success: true
        }),
        headers: {
            'Set-Cookie': [
                'accesstoken=mock-access-token; Path=/; HttpOnly',
                'refreshtoken=mock-refresh-token; Path=/; HttpOnly'
            ].join(', ')
        }
    })
    } else {
    await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
            statusCode: 400,
            message: 'Invalid credentials',
            success: false
        })
    })
    }
    })

    await page.goto(process.env.LOCALHOST)

    await page.getByTestId("ham-menu-btn").click()
    await page.getByTestId("login-btn").click()

    await expect(page).toHaveURL(/login/)

    await page.getByTestId("username-email-input").fill(process.env.TEST_USERNAME)
    await page.getByTestId("username-pass-input").fill("wrongpassword")
    await page.getByTestId("submit-login-btn").click()
    await expect(
        page.getByText("Invalid credentials",
        { exact: false })).toBeVisible({ timeout: 5000 })

    await page.getByTestId("username-pass-input").fill(process.env.TEST_PASSWORD)
    await page.getByTestId("submit-login-btn").click()

    await expect(
        page.locator('a.account', { hasText: process.env.TEST_USERNAME })
    ).toBeVisible({ timeout: 10000 })
})