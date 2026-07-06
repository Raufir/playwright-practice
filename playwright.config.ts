import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // CI attempt-fix #1: run sequentially in CI to avoid a burst of simultaneous
  // requests from one shared runner IP looking like a bot/DDoS attack to the
  // real site's WAF. Local runs stay fully parallel (undefined = auto workers).
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://automationteststore.com',
    trace: 'on-first-retry',
    // CI attempt-fix #2: a realistic desktop User-Agent, since some WAFs
    // specifically flag default headless/automation-flavored UA strings.
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
