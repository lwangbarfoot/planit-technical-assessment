import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL:
      process.env.BASE_URL ?? 'https://jupiter.cloud.planittesting.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results',
  projects: [
    {
      name: 'core-chromium',
      grepInvert: /@stability/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'stability-chromium',
      grep: /@stability/,
      repeatEach: 5,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
