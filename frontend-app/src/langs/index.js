import { createI18n } from 'vue-i18n'
import esLang from './es.json'

const i18n = createI18n({
     legacy: false,
     locale: 'es',
     messages: {
          es: esLang
     }
})

export default i18n
export const globalI18n = i18n.global