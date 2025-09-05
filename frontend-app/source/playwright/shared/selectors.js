// Usa roles accesibles y/o data-testid para tests estables
export const sel = {
  todayPatientsTitle: (root) =>
    root.getByRole("heading", { name: /Pacientes para hoy/i }),
};
