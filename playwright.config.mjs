import { defineConfig } from "./docs-site/node_modules/@playwright/test/index.mjs";
export default defineConfig({
  testDir: "./scripts",
  testMatch: "docs-redirects.browser.mjs",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:4173", browserName: "chromium" },
  webServer: {
    command: "node scripts/serve-combined-site.mjs",
    url: "http://127.0.0.1:4173/docs/get-started",
    reuseExistingServer: false,
  },
  reporter: "list",
  outputDir: "build/browser-results",
});
