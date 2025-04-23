import { defineStore, getActivePinia } from 'pinia'
import router from "../router"
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
     const user = ref(null);
     const isAuth = ref(false)
     const hasError = ref(null)
     const isLoadingAuthStore = ref(false)
     const token = ref(null)

     async function fetchLogin(username, password) {
          isLoadingAuthStore.value = true
          try {
               isAuth.value = false
               hasError.value = null
          } catch (error) {
               hasError.value = error
               isAuth.value = false
               setTimeout(() => { hasError.value = null }, 3000)
          } finally {
               isLoadingAuthStore.value = false
          }

     }
     async function logout() {
          localStorage.clear()
          isLoadingAuthStore.value = true
          user.value = null
          isAuth.value = false
          token.value = null
          hasError.value = null
          isLoadingAuthStore.value = false
          router.push('/login')
     }

     const authorizationHeader = computed(() => ({
          Authorization: `Bearer ${token.value}`
     }))

     return {
          user, isAuth, hasError, isLoadingAuthStore, authorizationHeader, token,
          fetchLogin, logout
     }
}, {
     persist: true
})

