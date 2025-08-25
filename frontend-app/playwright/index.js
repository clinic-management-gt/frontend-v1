import { beforeMount } from '@playwright/experimental-ct-vue/hooks';
import { createTestingPinia } from '@pinia/testing';

beforeMount(async ({ app, hooksConfig }) => {
  if (hooksConfig?.pinia) {
    const pinia = createTestingPinia({
      stubActions: false,
      ...(hooksConfig.pinia || {})
    });
    app.use(pinia);
  }
  // aquí puedes app.use(router) o app.use(i18n) si lo necesitas para CT
});
