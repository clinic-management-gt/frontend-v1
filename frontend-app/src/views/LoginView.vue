<template>
  <div
    class="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <img
        class="mx-auto"
        src="/logo-gastro.png"
        width="250"
        height="250"
      />
      <h2
        class="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        {{ $t("login.login") }}
      </h2>
      <p class="mt-2 text-sm text-green-600 font-semibold">
        ✅ Desplegado con GitHub Actions
      </p>
    </div>
    <form
      class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4"
      @submit.prevent="onSubmitLogin"
    >
      <text-input
        class="mt-2"
        name="email"
        type="email"
        title="login.mail"
        inputPlaceholder="login.placeholder-mail"
        inputColor="primary-color"
      />

      <text-input
        class="mt-2"
        name="password"
        type="password"
        title="login.password"
        inputPlaceholder="login.placeholder-password"
        inputColor="primary-color"
      />

      <div
        v-if="error !== null"
        class="text-red-600 text-sm"
      >
        {{ error }}
      </div>

      <primary-button
        type="submit"
        :disabled="isLoadingAuthStore || !isFormValid"
        class="w-full flex justify-center"
        @click="onSubmitLogin"
      >
        <basic-spinner-loading v-if="isLoadingAuthStore" />
        <span v-else>{{ $t("login.login") }}</span>
      </primary-button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useForm } from "vee-validate";
import { storeToRefs } from "pinia";
import * as yup from "yup";

import TextInput from "@components/forms/TextInput.vue";
import PrimaryButton from "@components/forms/PrimaryButton.vue";
import BasicSpinnerLoading from "@components/forms/BasicSpinnerLoading.vue";

const authStore = useAuthStore();
const { isLoadingAuthStore, error } = storeToRefs(authStore);
const validationError = ref(false);

const { handleSubmit, errors, values } = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  }),
});

const isFormValid = computed(() => {
  return (
    Object.keys(errors.value).length === 0 && values.email && values.password
  );
});

const onSubmitLogin = handleSubmit((values) => {
  validationError.value = false;
  authStore.fetchLogin({ email: values.email, password: values.password });
  if (authStore.error) {
    validationError.value = true;
  }
});
</script>
