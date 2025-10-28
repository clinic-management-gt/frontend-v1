<template>
  <div>
    <custom-label
      v-if="title"
      :title="title"
      :name="name"
      :textClass="labelCss"
      :isRequired="required"
    />
    <fieldset>
      <div
        class="flex flex-col md:flex-row md:space-x-6 space-y-5 md:space-y-0"
      >
        <div
          v-for="d in data"
          :key="d.id"
          class="relative flex flex-row items-start"
        >
          <div class="flex h-6 items-center">
            <input
              :id="d.id"
              v-model="value"
              :name="name"
              type="radio"
              :value="d.id"
              class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-patient-page-color checked:bg-patient-page-color focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patient-page-color disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
              @blur="handleBlur"
            />
          </div>
          <div class="ml-3 text-sm/6">
            <label :for="d.id" class="font-medium text-gray-900 cursor-pointer">
              {{ $t(d.name) }}
            </label>
          </div>
        </div>
      </div>
    </fieldset>
    <!-- Mensaje de error -->
    <p
      v-if="errorMessage"
      class="mt-1 text-sm text-red-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import CustomLabel from "@/components/forms/CustomLabel.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  labelCss: {
    type: String,
    default: "font-bold",
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const { value, errorMessage, handleBlur } = useField(props.name);
</script>
