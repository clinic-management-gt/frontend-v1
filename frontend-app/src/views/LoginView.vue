<template>
  <div class="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <img class="mx-auto" src="/logo-gastro.png" width="250" height="250" />
      <h2 class="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {{ $t('login.login') }}
      </h2>
    </div>

    <form @submit.prevent="onSubmitLogin" class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4">
      <TextInput class="mt-2" name="email" type="email" title="login.mail"
        inputPlaceholder="login.placeholder-mail" inputColor="primary-color"required />

      <TextInput class="mt-2" name="password" type="password" title="login.password"
        inputPlaceholder="login.placeholder-password" inputColor="primary-color" required />

      <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

      <PrimaryButton type="submit" :disabled="isLoadingAuthStore || !isFormValid"  class="w-full flex justify-center">
        <basic-spinner-loading v-if="isLoadingAuthStore"/>
        <span v-else>{{ $t('login.login') }}</span>
      </PrimaryButton>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useForm } from 'vee-validate'
import { storeToRefs } from "pinia"
import * as yup from 'yup';

import TextInput from '@components/forms/TextInput.vue'
import PrimaryButton from '@components/forms/PrimaryButton.vue'
import BasicSpinnerLoading from '@components/forms/BasicSpinnerLoading.vue'

const router = useRouter()
const authStore = useAuthStore()
const { isLoadingAuthStore, error } = storeToRefs(authStore)
const validationError = ref(false)
const { handleSubmit, errors, values } = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  })
})

const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0 && values.email && values.password
})

const onSubmitLogin = handleSubmit(async (values) => {
  validationError.value = false
  try {
    await authStore.fetchLogin({
      email: values.email,
      password: values.password
    })
  } catch (err) {
    validationError.value = true
  }
})


// async function onSubmit() {
//   loading.value = true
//   error.value = null

//   try {
//     await auth.fetchLogin({ email: email.value, password: password.value })
//     router.push({ path: '/dashboard' })
//   } catch (err) {
//     error.value =
//       err.message ||
//       err.error ||
//       'Credenciales incorrectas'
//   } finally {
//     loading.value = false
//   }
// }
</script>
