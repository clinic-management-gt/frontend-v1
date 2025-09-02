import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PatientHistoryLogBox from "@components/patientsComponents/PatientHistoryLogBox.vue";
import ActionButtonSolidIcon from "@components/forms/ActionButtonSolidIcon.vue";

// Mock `isoFormatDate` para evitar errores por dependencias internas
vi.mock("@utils/isoFormatDate", () => ({
  isoFormatDate: (iso) => ({
    longSpanishDate: new Date(iso).toLocaleDateString("es-ES"),
  }),
}));

const generateMockHistoryData = (count = 12) => {
  const base = new Date();
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    createdAt: new Date(base.getTime() - i * 86400000).toISOString(),
    date: new Date(base.getTime() - i * 86400000).toISOString(),
  }));
};

const mockData = generateMockHistoryData(12);

describe("PatientHistoryLogBox.vue", () => {
  it("renderiza correctamente el historial paginado (5 por página)", () => {
    const wrapper = mount(PatientHistoryLogBox, {
      props: { data: mockData },
      global: {
        mocks: {
          $t: (key) => key,
        },
      },
    });

    const items = wrapper.findAll("div.mb-2");
    expect(items.length).toBe(5);
  });

  it("avanza y retrocede de página correctamente", async () => {
    const wrapper = mount(PatientHistoryLogBox, {
      props: { data: mockData },
      global: {
        mocks: {
          $t: (key) => key,
        },
      },
    });

    expect(wrapper.text()).toContain("1 - 3");

    const nextBtn = wrapper
      .findAllComponents(ActionButtonSolidIcon)
      .find((b) => b.props().icon === "ChevronRightIcon");
    await nextBtn.trigger("click");
    expect(wrapper.text()).toContain("2 - 3");

    const prevBtn = wrapper
      .findAllComponents(ActionButtonSolidIcon)
      .find((b) => b.props().icon === "ChevronLeftIcon");
    await prevBtn.trigger("click");
    expect(wrapper.text()).toContain("1 - 3");
  });
});
