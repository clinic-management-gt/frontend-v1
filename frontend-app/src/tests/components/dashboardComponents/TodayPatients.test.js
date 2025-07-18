import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'
import TodayPatients from '@/components/dashboardComponents/TodayPatients.vue'
import { usePatientsStore } from '@/stores/patientsStore'

const mockAppointments = [
     {
          id: 1,
          patientName: 'Juan Pérez',
          doctorName: 'Dra. Gómez',
          date: '2025-07-18T10:30:00',
          status: 'pendiente'
     }
]

describe('TodayPatients.vue', () => {
     it('renderiza las citas de hoy correctamente', async () => {
          const pinia = createTestingPinia({ stubActions: false, createSpy: vi.fn })

          // Setear estado manualmente
          const store = usePatientsStore()
          store.fetchAppointmentsToday = vi.fn()
          store.appointmentsToday = mockAppointments
          store.isLoadingAppointmentsToday = false

          const wrapper = mount(TodayPatients, {
               global: {
                    plugins: [pinia],
                    mocks: {
                         $t: (msg) => msg
                    }
               }
          })

          await flushPromises()

          // Asegurarse de que renderizó correctamente
          expect(wrapper.text()).toContain('Pacientes para hoy')
          expect(wrapper.text()).toContain('Juan Pérez')
          expect(wrapper.text()).toContain('Dra. Gómez')
          expect(wrapper.text()).toMatch(/Fecha y Hora:/)
          expect(wrapper.text().toLowerCase()).toContain('pendiente')
     })
})
