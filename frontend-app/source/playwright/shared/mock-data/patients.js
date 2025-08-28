export const mockPatientsList = [
  { id: 1, name: "Juan Pérez", dpi: "1234567890101" },
  { id: 2, name: "María López", dpi: "2345678901202" },
];

export const mockPatientDetail = (id = 1) => ({
  id,
  name: id === 1 ? "Juan Pérez" : "María López",
  age: 31,
  phone: "5555-5555",
  address: "Zona 10",
});

export const mockMedicalRecords = (id = 1) => ({
  patientId: id,
  records: [
    {
      id: 101,
      date: "2025-07-18",
      notes: "Chequeo general",
      doctor: "Dra. Gómez",
    },
  ],
});
