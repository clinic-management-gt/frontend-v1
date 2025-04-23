<template>
     <div class="flex min-h-full flex-1 flex-col justify-center align-center min-h-screen px-6 py-12 lg:px-8">
          <div class="sm:mx-auto sm:w-full sm:max-w-sm">
               <img class="mx-auto" src="/logo-gastro.png" width="250" height="250" />
               <h2 id="app" class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"> {{
                    $t('login.login') }}</h2>
          </div>
          <form class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
               <text-input class="mt-2" name="email" type="email" title="login.mail"
                    inputPlaceholder="login.placeholder-mail" />
               <text-input class="mt-2" name="password" type="password" title="login.password"
                    inputPlaceholder="login.placeholder-password" />
               <primary-button>
                    <div>{{ $t('login.login') }}</div>
               </primary-button>
          </form>
     </div>
</template>
<script setup>
import TextInput from '@/components/forms/TextInput.vue'
import PrimaryButton from '@/components/forms/PrimaryButton.vue'

</script>