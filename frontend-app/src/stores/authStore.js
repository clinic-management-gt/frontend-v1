import { defineStore } from "pinia";
import { ref } from "vue";
import router from "@/router";
import instance from "@stores/axios.js";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);
    const token = ref(null);
    const error = ref(null);

    const isAuth = ref(false);
    const isLoadingAuthStore = ref(false);

    async function fetchLogin({ email, password }) {
      isLoadingAuthStore.value = true;
      error.value = null;

      try {
        const res = await instance.post("/auth/login", { email, password });
        token.value = res.data.token;
        user.value = res.data.user;
        
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
     */
    function logout() {
      localStorage.clear();
      token.value = null;
      user.value = null;
      isAuth.value = false;
      
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
