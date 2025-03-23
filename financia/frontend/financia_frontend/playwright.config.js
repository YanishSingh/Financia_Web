// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    testDir: './tests', // Change this if your test files are in a different folder
    timeout: 30000,
    use: {
      headless: true,
      baseURL: 'http://localhost:3000',
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    },
  };
  
  module.exports = config;
  