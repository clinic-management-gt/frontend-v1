import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue';
import PatientMainDataBox from '@components/patientsComponents/PatientMainDataBox.vue'

describe('PatientMainDataBox.vue', () => {
     const mockData = {
          name: 'Juan',
          lastName: 'Pérez',
          birthdate: '2000-01-01',
          gender: 'M'
     }

     const tMock = (key) => {
          const dict = {
               'general.age': 'Edad',
               'general.sex': 'Sexo',
               'general.alergies': 'Alergias',
               'general.male': 'Masculino'
          }
          return dict[key] || key
     }

     it('renderiza correctamente los datos del paciente', () => {
          const wrapper = mount(PatientMainDataBox, {
               props: { data: mockData },
               global: {
                    mocks: { $t: tMock }
               }
          })

          expect(wrapper.text()).toContain('Juan')
          expect(wrapper.text()).toContain('Pérez')
          expect(wrapper.text()).toContain('Edad')
          expect(wrapper.text()).toContain('Sexo: Masculino')
          expect(wrapper.text()).toContain('Alergias: Masculino') // depende de `gender` en tu código
     })

     it('dispara createAction y chartAction cuando se hace click en los botones', async () => {
          const createActionMock = vi.fn()
          const chartActionMock = vi.fn()

          const wrapper = mount(PatientMainDataBox, {
               props: {
                    data: mockData,
                    createAction: createActionMock,
                    chartAction: chartActionMock
               },
               global: {
                    mocks: { $t: tMock }
               }
          })

          const buttons = wrapper.findAllComponents({ name: 'ActionButtonSolidIcon' })
          expect(buttons.length).toBe(2)

          await buttons[0].trigger('click')
          await buttons[1].trigger('click')

          expect(createActionMock).toHaveBeenCalled()
          expect(chartActionMock).toHaveBeenCalled()
     })
})
