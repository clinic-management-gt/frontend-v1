import { test, expect } from '@playwright/test';

test('Login redirige al dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder(/correo/i).fill(process.env.E2E_EMAIL || 'tu@correo.com');
  await page.getByPlaceholder(/contraseña|password/i).fill(process.env.E2E_PASSWORD || 'secreta');
  await page.getByRole('button', { name: /iniciar sesi/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});
