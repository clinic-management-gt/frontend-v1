/**
 * Convierte un valor de género en su forma legible en español.
 *
 * @param {string} input - Valor del género ('F', 'Female', 'M', 'Male', etc.)
 * @returns {string} Género traducido: 'Femenino', 'Masculino' o 'No especificado'
 */
export function normalizeGender(input) {
  if (!input || typeof input !== "string") return "No especificado";

  const normalized = input.trim().toLowerCase();

  if (["f", "female", "femenino"].includes(normalized)) {
    return "general.female";
  }

  if (["m", "male", "masculino"].includes(normalized)) {
    return "general.male";
  }

  return "general.not-specified";
}
