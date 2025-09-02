// source/playwright/config/playwright.e2e.config.js
import "dotenv/config";
import fs from "node:fs";
import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEST_DIR = resolve(__dirname, "../test-e2e");

const STORAGE_PATH = ".auth/user.json";
const hasStorage = fs.existsSync(STORAGE_PATH);

export default defineConfig({
  testDir: TEST_DIR,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5178",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "yarn build && yarn preview --port 5178",
    url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5178",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    // 1) corre el setup que hace login y guarda sesión
    { name: "setup", testMatch: /.*\/_setup\/auth\.setup\.js/ },

    // 2) navegadores que usan la sesión si el archivo existe
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(hasStorage ? { storageState: STORAGE_PATH } : {}),
        viewport: { width: 1280, height: 800 },
      },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        ...(hasStorage ? { storageState: STORAGE_PATH } : {}),
      },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        ...(hasStorage ? { storageState: STORAGE_PATH } : {}),
      },
      dependencies: ["setup"],
    },
  ],
});
