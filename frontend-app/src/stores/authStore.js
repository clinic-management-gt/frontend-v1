import { defineStore } from "pinia";
import { ref } from "vue";
import router from "@/router";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // Token JWT hardcodeado para desarrollo
    const user = ref({
      id: 1,
      name: "Usuario Prueba",
      email: "test@example.com",
      role: "admin"
    });
    // Token JWT ficticio para pruebas de desarrollo
    const token = ref("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
    const error = ref(null);

    const isAuth = ref(true); // Autenticado por defecto para desarrollo
    const isLoadingAuthStore = ref(false);

    async function fetchLogin({ email, password }) {
      isLoadingAuthStore.value = true;
      error.value = null;

      try {
        // Para desarrollo: simulamos un login exitoso con datos hardcodeados
        console.log("Login con credenciales:", { email, password });
        
        // No enviamos la petición real al backend para pruebas
        // const res = await instance.post("/auth/login", { email, password });
        // token.value = res.data.token;
        // user.value = res.data.user;
        
        // Usamos valores hardcodeados
        token.value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        user.value = {
          id: 1,
          name: "Usuario Prueba",
          email: email || "test@example.com",
          role: "admin"
        };
        
        isAuth.value = true;
        router.push({ path: "/dashboard" });
      } catch (err) {
        // Manejo de error con fallback de mensaje
        const message = err.response?.data?.message || "Login fallido";
        error.value = new Error(message);
        isAuth.value = false;
        throw error.value;
      } finally {
        isLoadingAuthStore.value = false;
      }
    }

    /**
     * logout: limpia todo y redirige al login
     * En desarrollo, mantiene el token ficticio
     */
    function logout() {
      localStorage.clear();
      // Para desarrollo: no limpiamos completamente el token
      // token.value = null;
      // user.value = null;
      // isAuth.value = false;
      
      // Solo limpiamos datos del usuario pero mantenemos el token para pruebas
      user.value = {
        id: 1,
        name: "Usuario Prueba",
        email: "test@example.com",
        role: "admin"
      };
      
      router.push("/login");
    }

    return {
      user,
      token,
      isAuth,
      isLoadingAuthStore,
      error,
      fetchLogin,
      logout,
    };
  },
  {
    persist: {
      paths: ["token", "user", "isAuth"],
    },
  },
);
