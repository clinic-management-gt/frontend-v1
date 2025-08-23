import { test, expect } from '@playwright/test';

const mockPatientsList = [
  { id: 1, name: 'Juan Pérez',  dpi: '1234567890101' },
  { id: 2, name: 'María López', dpi: '2345678901202' }
];
const mockPatientDetail = id => ({
  id, name: id === 1 ? 'Juan Pérez' : 'María López', age: 31
});
const mockMedicalRecords = id => ({
  patientId: id,
  records: [{ id: 101, date: '2025-07-18', notes: 'Chequeo general', doctor: 'Dra. Gómez' }]
});

test('Dashboard -> Pacientes -> Ver detalle', async ({ page }) => {
  // Mocks (ajusta prefijo /api según tu axios instance)
  await page.route('**/patients', route => {
    if (/\/patients\/\d+/.test(route.request().url())) return route.fallback();
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPatientsList) });
  });
  await page.route(/\/patients\/\d+$/, route => {
    const id = Number(route.request().url().match(/\/patients\/(\d+)$/)[1]);
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPatientDetail(id)) });
  });
  await page.route(/\/patients\/\d+\/medicalrecords.*/, route => {
    const id = Number(route.request().url().match(/\/patients\/(\d+)\//)[1]);
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockMedicalRecords(id)) });
  });

  // Entra autenticado
  await page.goto('/');
  await expect(page).toHaveURL(/\/dashboard$/);

  // Ir a Pacientes (ideal con data-testid en tu NavigationView)
  // <RouterLink to="/patients" data-testid="nav-patients">Pacientes</RouterLink>
  const patientsLink = page.getByTestId('nav-patients');
  await patientsLink.click();
  await expect(page).toHaveURL(/\/patients$/);

  // Ver que se pintó la lista
  await expect(page.getByText('Juan Pérez')).toBeVisible();
  await expect(page.getByText('María López')).toBeVisible();

  // Abrir detalle del primer paciente (mejor con testid en el botón)
  // <button data-testid="patient-open-1">Ver</button>
  await page.getByTestId('patient-open-1').click();

  // Validar detalle (viene de mock)
  await expect(page.getByText(/Chequeo general/i)).toBeVisible();
  await expect(page.getByText(/Dra\. Gómez/i)).toBeVisible();
});
