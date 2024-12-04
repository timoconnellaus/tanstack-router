import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e-playwright/tests',
  // timeout: 5 * 60 * 1000,

  reporter: [['line']],

  // use: {
  //   /* Base URL to use in actions like `await page.goto('/')`. */
  //   baseURL: 'http://localhost:3003/',
  // },

  // webServer: {
  //   // TODO: build && start seems broken, use that if it's working
  //   command: 'pnpm run dev',
  //   url: 'http://localhost:3002',
  //   reuseExistingServer: !process.env.CI,
  //   stdout: 'pipe',
  // },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
