/**
 * Formatea una fecha en formato español
 * @param {string} dateString - Fecha en formato ISO string
 * @param {Object} options - Opciones de formateo
 * @returns {string} Fecha formateada o mensaje de error
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return 'Fecha no disponible'
  
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }
    
    return new Date(dateString).toLocaleDateString('es-ES', defaultOptions)
  } catch (error) {
    console.error('Error al formatear fecha:', error)
    return 'Fecha inválida'
  }
}

/**
 * Formatea una fecha solo con día, mes y año
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha formateada
 */
export function formatDateShort(dateString) {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formatea una fecha con hora completa
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha formateada con hora
 */
export function formatDateTime(dateString) {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
