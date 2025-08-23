import { test, expect } from '@playwright/experimental-ct-vue';
import TodayPatients from '@/components/dashboardComponents/TodayPatients.vue';

test('renderiza TodayPatients (CT)', async ({ mount }) => {
  const cmp = await mount(TodayPatients, {
    // si necesitas Pinia, la agregamos vía hooks (ver paso 5)
  });
  await expect(cmp.getByRole('heading', { name: /Pacientes para hoy/i })).toBeVisible();
});
