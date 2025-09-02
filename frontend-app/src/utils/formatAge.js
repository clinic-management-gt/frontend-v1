/**
 * Calcula la edad desde una fecha de nacimiento.
 *
 * @param {string|Date} birthDate - Fecha de nacimiento (formato ISO o Date)
 * @param {'number' | 'string'} format - 'number' = solo años (int), 'string' = texto con años y meses
 * @returns {number|string} Edad como número o como texto (ej: '9 años y 4 meses')
 */
export function formatAgeFromDate(birthDate, format = "number") {
  const birth = new Date(birthDate);
  const now = new Date();

  if (isNaN(birth.getTime())) {
    return format === "number" ? null : "Fecha inválida";
  }

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (format === "number") {
    return years;
  }

  // Construir texto legible
  const yearText = years > 0 ? `${years} año${years !== 1 ? "s" : ""}` : "";
  const monthText =
    months > 0 ? `${months} mes${months !== 1 ? "es" : ""}` : "";

  if (yearText && monthText) return `${yearText} y ${monthText}`;
  if (yearText) return yearText;
  if (monthText) return monthText;

  // Si ni años ni meses, mostrar días
  const diffInDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
  return `${diffInDays} día${diffInDays !== 1 ? "s" : ""}`;
}
