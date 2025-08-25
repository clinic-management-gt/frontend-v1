import { test, expect } from '@playwright/test';

const EMAIL = process.env.E2E_EMAIL ?? '';
const PASSWORD = process.env.E2E_PASSWORD ?? '';

test('login y guardo sesión', async ({ page }) => {
  // Valida credenciales antes de intentar fill
  if (!EMAIL || !PASSWORD) {
    throw new Error('Faltan E2E_EMAIL o E2E_PASSWORD (define .env o pasa variables al comando).');
  }

  await page.goto('/login');

  // Asegura que los inputs existen (ajusta si tus selectores son otros)
  const emailInput = page.getByPlaceholder(/correo/i);         // "Ingrese su correo"
  const passInput  = page.getByPlaceholder(/contraseñ|password/i); // "Ingrese su contraseña"
  const submitBtn  = page.getByRole('button', { name: /iniciar sesi/i });

  await expect(emailInput).toBeVisible();
  await expect(passInput).toBeVisible();
  await emailInput.fill(EMAIL);
  await passInput.fill(PASSWORD);
  await submitBtn.click();

  // espera a dashboard
  await page.waitForURL('**/dashboard', { timeout: 15_000 });

  // guarda sesión
  await page.context().storageState({ path: '.auth/user.json' });
});
