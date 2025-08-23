import { test, expect } from '@playwright/test';

// Datos de prueba
const mockAppointments = [
  { id: 1, patientName: 'Juan Pérez',  doctorName: 'Dra. Gómez', date: '2025-08-22T10:00:00', status: 'pendiente' },
  { id: 2, patientName: 'María López', doctorName: 'Dr. Ruiz',   date: '2025-08-22T12:30:00', status: 'confirmada' },
];

test('navego al Calendario y veo eventos del día', async ({ page }) => {
  // ⚠️ no borres localStorage aquí si tu auth vive en "pinia"

  // Intercepta las URLs que usa tu vista de Calendario.
  // Ajusta a tu prefijo real (p.ej. '**/api/appointments')
  await page.route((url) => /\/appointments(\?|$)/.test(url), route => {
    if (/\/appointments\/\d+/.test(route.request().url())) return route.fallback();
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAppointments)
    });
  });

  // Opción A: ir directo
  await page.goto('/calendar');

  // Opción B (si prefieres simular el click del menú):
  // await page.goto('/dashboard');
  // await page.getByRole('link', { name: /calendario/i }).click();
  // // mejor si agregas data-testid="nav-calendar" y usas:
  // // await page.getByTestId('nav-calendar').click();

  // Aserción de que cargó el calendario (elige el que aplique a tu UI)
  await expect(
    page.getByTestId('calendar-root')   // si agregas data-testid al contenedor
      .or(page.getByRole('heading', { name: /calendario/i }))
      .or(page.locator('.fc'))          // FullCalendar tiene clase .fc
  ).toBeVisible();

  // Los eventos deberían verse como texto. Si FullCalendar no pinta el título completo,
  // añade un render con data-testid en tu componente (ver nota abajo).
  await expect(page.getByText(/Juan Pérez/)).toBeVisible();
  await expect(page.getByText(/María López/)).toBeVisible();

  // (Opcional) Avanzar mes/semana
  // Ideal: data-testid="cal-next" en tu botón
  const nextBtn = page.getByTestId('cal-next')
    .or(page.getByRole('button', { name: /siguiente|next/i }));
  // Si existe, haz click:
  if (await nextBtn.count()) await nextBtn.click();
});
