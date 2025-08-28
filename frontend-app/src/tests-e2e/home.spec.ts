import { test, expect } from "@playwright/test";

test("Home renderiza y muestra el título", async ({ page }) => {
  await page.goto("/"); // baseURL + '/'
  // ajusta a tu selector real
  await expect(
    page.getByRole("heading", { name: /inicio|home/i }),
  ).toBeVisible();
});
