const config = {
  testDir: './tests/e2e',
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'Desktop Firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 800, height: 600 },
      },
    },
  ],
  expect: {
    toMatchSnapshot: { threshold: 0.8 },
  },
  setupFilesAfterEnv: ["expect-playwright"],
};

module.exports = config;