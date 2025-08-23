// home.spec.ts
import { test, expect } from '@playwright/test';

test('Home renderiza', async ({ page }) => {
  await page.goto('/'); // usa baseURL de la config
  await expect(page.getByRole('heading', { name: /inicio|home/i })).toBeVisible();
});

