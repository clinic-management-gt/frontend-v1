<template>
  <div
    class="flex justify-center items-center mb-2 outlined-patient-page-color outline-dotted"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div :class="{ 'opacity-60 pointer-events-none': isDragging }">
      <input
        id="filePdf_input"
        ref="filePdf"
        class="hidden"
        type="file"
        :accept="aceptAll ? '*/*' : 'application/pdf'"
        @change="handleFilePdf"
      />
      <div class="flex items-center m-4">
        <action-button-outlined-icon
          v-if="!filePdfUploaded"
          icon="ArrowUpTrayIcon"
          size="h-6 w-6"
          color="text-patient-page-color"
          @click="triggerFilePdf"
        />
        <a class="ml-2" role="button" @click="triggerFilePdf">
          {{ $t(title) }}
        </a>
        <action-button-outlined-icon
          v-if="filePdfUploaded"
          icon="CheckCircleIcon"
          size="h-6 w-6 mr-1"
        />
        <action-button-outlined-icon
          v-if="filePdfUploaded"
          icon="TrashIcon"
          size="h-6 w-6 mr-1"
          color="text-red-500"
          @click="deletePdf"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ActionButtonOutlinedIcon from "@components/forms/ActionButtonOutlinedIcon.vue";
import { ref } from "vue";

const emit = defineEmits(["sendFiles"]);
const props = defineProps({
  data: { type: [String, File, Object], default: null },
  title: { type: String, required: true },
  aceptAll: { type: Boolean, default: false },
  currentSelected: { type: [String, Object, File], default: null },
});

const filePdf = ref(null);
const filePdfUploaded = ref(!!props.data);
const uploadedFile = ref(props.data || null);

const triggerFilePdf = () => filePdf.value?.click();

const handleFilePdf = (event) => {
  const files = event.target.files || [];
  if (files.length) {
    filePdfUploaded.value = true;
    uploadedFile.value = files[0];
    emit("sendFiles", uploadedFile.value);
  } else {
    filePdfUploaded.value = false;
    uploadedFile.value = null;
    emit("sendFiles", null);
  }
};

const isDragging = ref(false);
const onDragOver = () => (isDragging.value = true);
const onDragLeave = () => (isDragging.value = false);
const onDrop = (event) => {
  const files = event.dataTransfer?.files || [];
  if (files.length) {
    filePdfUploaded.value = true;
    uploadedFile.value = files[0];
    emit("sendFiles", uploadedFile.value);
  } else {
    filePdfUploaded.value = false;
    uploadedFile.value = null;
    emit("sendFiles", null);
  }
  isDragging.value = false;
};

function deletePdf() {
  uploadedFile.value = null;
  filePdfUploaded.value = false;
  emit("sendFiles", null);
}
</script>
