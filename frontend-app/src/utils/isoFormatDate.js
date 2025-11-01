import { useI18n } from "vue-i18n";

/**
 * isoFormatDate
 * ---------------------------------------------------------------------
 * 1) Descripción:
 *    Convierte una entrada de fecha (Date | número timestamp | string) en
 *    varios formatos útiles (ISO8601, isoDate YYYY-MM-DD, local dd/mm/yyyy,
 *    longSpanishDate con mes en español, timestamp y el objeto Date original).
 *    Retorna null si la entrada no es una fecha válida.
 *
 *    Retorna: Un objeto con las propiedades:
 *      - iso8601: string (ej. "2025-10-29T15:30:00.000Z")
 *      - isoDate: string (ej. "2025-10-29")
 *      - localDate: string (ej. "29/10/2025")
 *      - longSpanishDate: string (ej. "29 de octubre de 2025")
 *      - timestamp: number (ms desde 1970)
 *      - rawDate: Date (objeto Date)
 *
 * 2) Parámetros:
 *    - dateInput: Date | number | string
 *      - Ejemplos de entrada:
 *          new Date('2025-10-29T15:30:00Z')
 *          1769815800000                    // timestamp en ms
 *          '2025-10-29T15:30:00Z'           // ISO string
 *
 * 3) Ejemplo de salida (para la entrada '2025-10-29T15:30:00Z'):
 *    {
 *      iso8601: '2025-10-29T15:30:00.000Z',
 *      isoDate: '2025-10-29',
 *      localDate: '29/10/2025',
 *      longSpanishDate: '29 de octubre de 2025',
 *      timestamp: 1769815800000,
 *      rawDate: Date('2025-10-29T15:30:00.000Z')
 *    }
 */


export function isoFormatDate(dateInput) {
  /**
   * parseDate
   * 1) Descripción:
   *    Intenta normalizar la entrada a un objeto Date válido. Acepta Date,
   *    número (timestamp en ms) o string (parseable por Date). Retorna null
   *    si no es válido.
   *
   * 2) Parámetros:
   *    - input: Date | number | string
   *      Ejemplo: '2025-10-29T15:30:00Z'  o  1769815800000  o  new Date()
   *
   * 3) Retorno:
   *    - Date válido ó null si no se pudo parsear.
   */
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

  /**
   * pad2
   * 1) Descripción:
   *    Rellena con cero a la izquierda para asegurar 2 dígitos (p. ej. 3 -> '03').
   *
   * 2) Parámetros:
   *    - n: number
   *      Ejemplo: 5
   *
   * 3) Retorno:
   *    - string con al menos 2 caracteres: '05'
   */
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

  const iso8601 = date.toISOString();
  const isoDate = `${year}-${month}-${day}`;
  const localDate = `${day}/${month}/${year}`;
  const longSpanishDate = `${day} de ${t(monthNames[date.getMonth()])} de ${year}`;
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
 * formatDate
 * ---------------------------------------------------------------------
 * 1) Descripción:
 *    Formatea una fecha (string ISO o valor parseable por Date) usando las
 *    opciones de Intl.DateTimeFormat para 'es-ES'. Retorna un string con la
 *    fecha y hora según las opciones pasadas. Si no se proporciona
 *    `dateString` devuelve 'Fecha no disponible'.
 *
 * 2) Parámetros:
 *    - dateString: string | Date (ej. '2025-10-29T15:30:00Z' o new Date())
 *    - options: Object (opciones de formateo Intl) (ej. { hour: '2-digit', minute: '2-digit' })
 *
 *    Ejemplo de llamada:
 *      formatDate('2025-10-29T15:30:00Z', { hour: '2-digit', minute: '2-digit' })
 *
 * 3) Ejemplo de retorno:
 *    - '29 de octubre de 2025, 15:30'  (formato depende de las opciones proporcionadas)
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return "Fecha no disponible";
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };
  return new Date(dateString).toLocaleDateString("es-ES", defaultOptions);
}

/**
 * formatDateShort
 * ---------------------------------------------------------------------
 * 1) Descripción:
 *    Formatea la fecha mostrando sólo día, mes (nombre largo) y año en
 *    español.
 *
 * 2) Parámetros:
 *    - dateString: string | Date (ej. '2025-10-29' o new Date())
 *
 * 3) Ejemplo de retorno:
 *    - '29 de octubre de 2025'
 */
export function formatDateShort(dateString) {
  return formatDate(dateString, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * formatDateTime
 * ---------------------------------------------------------------------
 * 1) Descripción:
 *    Formatea la fecha incluyendo día, mes, año y hora con segundos.
 *
 * 2) Parámetros:
 *    - dateString: string | Date (ej. '2025-10-29T15:30:00Z')
 *
 * 3) Ejemplo de retorno:
 *    - '29 de octubre de 2025, 15:30:00'
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

/**
 * formatDateShortest
 * ---------------------------------------------------------------------
 * 1) Descripción:
 *    Devuelve la fecha en formato numérico corto dd/mm/yyyy.
 *
 * 2) Parámetros:
 *    - dateString: string | Date (ej. '2025-10-29' o new Date())
 *
 * 3) Ejemplo de retorno:
 *    - '29/10/2025'
 */
export function formatDateShortest(dateString) {
  if (!dateString) return "Fecha no disponible";
  const defaultOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", defaultOptions);
}

/**
 * formatDateLong
 * ---------------------------------------------------------------------
 * 1) Descripción:
 *    Devuelve la fecha en formato largo en español (ej. '15 de octubre de 2025')
 *    sin incluir la hora.
 *
 * 2) Parámetros:
 *    - dateString: string | Date (ej. '2025-10-29' o new Date())
 *
 * 3) Ejemplo de retorno:
 *    - '29 de octubre de 2025'
 */
export function formatDateLong(dateString) {  
  if (!dateString) return "Fecha no disponible";
  
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
