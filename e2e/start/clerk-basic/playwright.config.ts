import { defineConfig, devices } from '@playwright/test'

import dotenv from 'dotenv'

dotenv.config()

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  reporter: [['line']],

  // use: {
  //   /* Base URL to use in actions like `await page.goto('/')`. */
  //   baseURL: 'http://localhost:3002/',
  // },

  // webServer: {
  //   // TODO: build && start seems broken, use that if it's working
  //   command: 'pnpm dev',
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
