import { test, expect } from '@playwright/test';

test('smoke abre Home', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/localhost:5173/);
});
