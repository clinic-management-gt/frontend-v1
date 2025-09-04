import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

vi.mock("@/stores/patientsStore", () => ({
  usePatientsStore: () => ({
    currentPatientSelectedData: {
      value: {
        name: "Ana",
        lastName: "Pérez",
        gender: "Female",
        insurance: "RPN",
        familyPediatrician: "Dr. Schodiler",
        birthdate: "2001-01-01",
      },
    },
  }),
}));

vi.mock("@/stores/patientsLogicStore", () => ({
  usePatientsLogicStore: () => ({
    showDataSheetPatientDialog: true,
    closeAllPatientDialog: vi.fn(),
  }),
}));

import PatientsDataSheetDialog from "@/components/patientsDialogsComponents/PatientsDataSheetDialog.vue";

// Stub que renderiza los slots manualmente
const GeneralDialogModalStub = {
  template: `
    <div>
      <div data-testid="modal-title"><slot name="title" /></div>
      <div data-testid="modal-body"><slot name="body" /></div>
      <div data-testid="modal-buttons"><slot name="buttons" /></div>
    </div>
  `,
};

describe("PatientsDataSheetDialog.vue", () => {
  it("muestra datos del paciente cuando el modal está abierto", async () => {
    const wrapper = mount(PatientsDataSheetDialog, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          GeneralDialogModal: GeneralDialogModalStub,
          // Panel: true
        },
        mocks: {
          $t: (msg) => msg,
        },
      },
      props: {
        isOpen: true,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Ana");
    expect(wrapper.text()).toContain("Pérez");
    expect(wrapper.text()).toContain("2001-01-01");
  });
});
