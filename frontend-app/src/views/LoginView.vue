<template>
  <div class="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <img class="mx-auto" src="/logo-gastro.png" width="250" height="250" />
      <h2 class="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {{ $t('login.login') }}
      </h2>
    </div>

    <form
      @submit.prevent="onSubmit"
      class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4"
    >
      <TextInput
        v-model="email"
        class="mt-2"
        name="email"
        type="email"
        title="login.mail"
        inputPlaceholder="login.placeholder-mail"
        required
      />

      <TextInput
        v-model="password"
        class="mt-2"
        name="password"
        type="password"
        title="login.password"
        inputPlaceholder="login.placeholder-password"
        required
      />

      <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

      <PrimaryButton
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center"
      >
        <span v-if="loading">{{ $t('login.entrando') }}</span>
        <span v-else>{{ $t('login.login') }}</span>
      </PrimaryButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import TextInput from '@/components/forms/TextInput.vue'
import PrimaryButton from '@/components/forms/PrimaryButton.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function onSubmit() {
  loading.value = true
  error.value = null

  try {
    await auth.fetchLogin({ email: email.value, password: password.value })
    router.push({ path: '/dashboard' })
  } catch (err) {
    error.value =
      err.message ||
      err.error ||
      'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>
