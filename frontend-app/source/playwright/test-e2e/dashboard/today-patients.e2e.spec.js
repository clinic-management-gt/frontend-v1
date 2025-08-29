import { test, expect } from '@playwright/test';

const mockAppointmentsToday = [
  { id: 1, patientName: 'Juan Pérez', doctorName: 'Dra. Gómez', date: '2025-07-18T10:30:00', status: 'pendiente' }
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.removeItem('pinia'); } catch {} });
});

test('Dashboard muestra "Pacientes para hoy"', async ({ page }) => {
  await page.route('**/appointments/today', route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockAppointmentsToday) });
  });

  await page.goto('/');                       // ya entras autenticado por storageState
  await expect(page).toHaveURL(/\/dashboard$/);

  await expect(page.getByRole('heading', { name: /Pacientes para hoy/i }).or(page.getByText(/Pacientes para hoy/i))).toBeVisible();
  await expect(page.getByText('Juan Pérez')).toBeVisible();
  await expect(page.getByText('Dra. Gómez')).toBeVisible();
  await expect(page.getByText(/pendiente/i)).toBeVisible();
});
