import axios from "axios";
import { useAuthStore } from "@stores/authStore.js";
import { storeToRefs } from "pinia";
import { handleHttpError } from "@utils/errorHandler";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const { token } = storeToRefs(authStore);
    if (token.value !== null) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.defaults.headers.common["Content-Type"] = "application/json";

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleHttpError(error);
    return Promise.reject(error);
  },
);

export default instance;
