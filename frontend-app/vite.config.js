import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    mode === 'development' && VueDevTools()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
      "@langs": fileURLToPath(new URL("./src/langs", import.meta.url)),
      "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
      "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.js"],
  },
}));
