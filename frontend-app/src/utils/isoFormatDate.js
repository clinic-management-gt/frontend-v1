import { useI18n } from "vue-i18n";

export function isoFormatDate(dateInput) {
  function parseDate(input) {
    if (input instanceof Date) return isNaN(input) ? null : input;
    if (typeof input === "number") {
      const d = new Date(input);
      return isNaN(d) ? null : d;
    }
    if (typeof input === "string") {
      const d = new Date(input);
      return isNaN(d) ? null : d;
    }
    return null;
  }

  function pad2(n) {
    return n.toString().padStart(2, "0");
  }

  const { t } = useI18n();

  const monthNames = [
    "calendar.january",
    "calendar.february",
    "calendar.march",
    "calendar.april",
    "calendar.may",
    "calendar.june",
    "calendar.july",
    "calendar.august",
    "calendar.september",
    "calendar.october",
    "calendar.november",
    "calendar.december",
  ];

  const date = parseDate(dateInput);
  if (!date) return null;

  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());
  const milliseconds = date.getMilliseconds();

  const iso8601 = date.toISOString();
  const isoDate = `${year}-${month}-${day}`;
  const localDate = `${day}/${month}/${year}`;
  const longSpanishDate = `${day} de ${t(
    monthNames[date.getMonth()],
  )} de ${year}`;
  const timestamp = date.getTime();

  return {
    iso8601,
    isoDate,
    localDate,
    longSpanishDate,
    timestamp,
    rawDate: date,
  };
}

/**
 * Formatea una fecha en formato español (funciones simplificadas para compatibilidad)
 * @param {string} dateString - Fecha en formato ISO string
 * @param {Object} options - Opciones de formateo
 * @returns {string} Fecha formateada o mensaje de error
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return "Fecha no disponible";

  try {
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    };

    return new Date(dateString).toLocaleDateString("es-ES", defaultOptions);
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha inválida";
  }
}

/**
 * Formatea una fecha solo con día, mes y año
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha formateada
 */
export function formatDateShort(dateString) {
  return formatDate(dateString, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formatea una fecha con hora completa
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha formateada con hora
 */
export function formatDateTime(dateString) {
  return formatDate(dateString, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
