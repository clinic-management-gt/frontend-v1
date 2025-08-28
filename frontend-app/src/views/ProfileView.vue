<template>
  <div class="p-6">
    <div
      class="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden"
    >
      <!-- Cabecera de color -->
      <div class="h-32 bg-teal-400"></div>

      <div class="flex flex-col items-center -mt-16 px-6 pb-6">
        <!-- Avatar -->
        <div
          class="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200"
        >
          <img
            v-if="user.avatarUrl"
            :src="user.avatarUrl"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <svg
            v-else
            class="w-full h-full text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                 1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>

        <!-- Nombre completo y email -->
        <h2 class="mt-4 text-2xl font-semibold text-gray-800">
          {{ fullName }}
        </h2>
        <p class="text-gray-500">{{ user.email }}</p>

        <!-- Datos extra: rol y fecha de creación -->
        <div
          class="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-center"
        >
          <div>
            <p class="text-sm text-gray-400">Rol</p>
            <p class="mt-1 font-medium text-gray-700">{{ user.role }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400">Creado el</p>
            <p class="mt-1 font-medium text-gray-700">
              {{ formattedCreatedAt }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

// Pinia store
const authStore = useAuthStore();
const user = computed(() => authStore.user || {});

// Nombre completo
const fullName = computed(() => {
  const { first_name = "", last_name = "" } = user.value;
  return [first_name, last_name].filter(Boolean).join(" ") || "Sin nombre";
});

// Fecha formateada con API nativa
const formattedCreatedAt = computed(() => {
  if (!user.value.created_at) return "—";
  return new Date(user.value.created_at).toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
});
</script>
