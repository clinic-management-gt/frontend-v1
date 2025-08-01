import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.js'
import { storeToRefs } from 'pinia'

const instance = axios.create({
     baseURL: `${import.meta.env.VITE_API_URL}`,
     timeout: 10000,
})

instance.interceptors.request.use(
     (config) => {
          const authStore = useAuthStore()
          const { token } = storeToRefs(authStore)
          if (token.value !== null) {
               config.headers.Authorization = `Bearer ${token.value}`
          }
          return config
     },
     (error) => Promise.reject(error)
)

instance.defaults.headers.common['Content-Type'] = 'application/json'

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      console.warn('Token expirado o no autorizado')
      authStore.logout()
    }

    if (error.response?.status === 500) {
      console.error('Error del servidor (500):', error.response.data?.message || '')
    }

    return Promise.reject(error)
  }
)

export default instance
