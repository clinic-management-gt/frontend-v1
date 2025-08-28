<template>
  <form @submit.prevent>
    <button :class="[buttonStyles]">
      <p v-if="props.title !== 'general.empty'" class="mr-2">
        {{ $t(props.title) }}
      </p>
      <component :is="icons[icon]" :class="[props.color, props.size]" />
    </button>
  </form>
</template>
<script setup>
import {
  FolderPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  DocumentPlusIcon,
  FolderArrowDownIcon,
  XCircleIcon,
  PlusCircleIcon,
  UserIcon,
  ArrowLongRightIcon,
  CheckIcon,
  ArchiveBoxIcon,
  ListBulletIcon,
  DocumentIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
  CakeIcon,
  IdentificationIcon,
  ScaleIcon,
  KeyIcon,
  ChartBarSquareIcon,
} from "@heroicons/vue/24/solid";
const props = defineProps({
  icon: String,
  color: {
    type: String,
    default: "text-primary-color",
  },
  size: {
    type: String,
    default: "h-6 w-6",
  },
  title: {
    type: String,
    default: "general.empty",
  },
  buttonStyles: {
    type: String,
    default: "flex justify-center sm:px-2 sm:py-2",
  },
});
const icons = {
  FolderPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  DocumentPlusIcon,
  FolderArrowDownIcon,
  XCircleIcon,
  PlusCircleIcon,
  UserIcon,
  ArrowLongRightIcon,
  CheckIcon,
  ArchiveBoxIcon,
  ListBulletIcon,
  DocumentIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
  CakeIcon,
  IdentificationIcon,
  ScaleIcon,
  KeyIcon,
  ChartBarSquareIcon,
};
</script>
