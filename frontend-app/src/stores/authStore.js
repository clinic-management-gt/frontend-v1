import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref(null)
  const token   = ref(localStorage.getItem('jwt') || '')
  const isAuth  = ref(!!token.value)
  const loading = ref(false)
  const error   = ref(null)

  /**
   * fetchLogin recibe un objeto { email, password },
   * hace POST a /auth/login y guarda token + user.
   */
  async function fetchLogin({ email, password }) {
    loading.value = true
    error.value   = null

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      )

      if (!res.ok) {
        // asume que el backend devuelve JSON { message: '...' } en errores 4xx
        const errBody = await res.json()
        throw new Error(errBody.message || 'Login fallido')
      }

      const { token: jwt, user: u } = await res.json()
      token.value  = jwt
      user.value   = u
      isAuth.value = true
      localStorage.setItem('jwt', jwt)
    } catch (err) {
      error.value   = err
      isAuth.value  = false
      throw err     // relanza para que el componente muestre el mensaje
    } finally {
      loading.value = false
    }
  }

  /**
   * logout: limpia todo y redirige al login
   */
  function logout() {
    token.value  = ''
    user.value   = null
    isAuth.value = false
    localStorage.removeItem('jwt')
  }

  /**
   * authHeaders: helper para incluir en fetch posteriores
   */
  function authHeaders() {
    return token.value
      ? { Authorization: `Bearer ${token.value}` }
      : {}
  }

  return {
    user,
    token,
    isAuth,
    loading,
    error,
    fetchLogin,
    logout,
    authHeaders
  }
}, {
  persist: {
    paths: ['token', 'user', 'isAuth']
  }
})
