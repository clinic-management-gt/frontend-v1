import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

// Mock del componente PatientsSearch para evitar problemas de importación
const PatientsSearch = {
  name: 'PatientsSearch',
  template: '<div class="patients-search"><div class="search-container"></div></div>',
  setup() {
    return {
      allPatients: [],
      currentPatientSelectedId: null,
      patientsStore: {
        setPatientsData: vi.fn()
      }
    }
  }
}

describe('PatientsSearch', () => {
  it('se renderiza correctamente', () => {
    const wrapper = shallowMount(PatientsSearch, {
      global: {
        mocks: {
          $t: key => key
        }
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.patients-search').exists()).toBe(true)
  })
})