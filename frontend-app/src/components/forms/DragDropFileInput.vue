<template>
     <div class="flex justify-center items-center mb-2 outlined-patient-page-color outline-dotted"
          @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
          <div :disabled="isDragging">
               <input ref="filePdf" class="hidden" @change="handleFilePdf" id="filePdf_input" type="file"
                    :accept="aceptAll ? true : 'application/pdf'">
               <div class="flex items-center m-4">
                    <action-button-solid v-if="!filePdfUploaded" icon="ArrowUpTrayIcon" size="h-6 w-6"
                         color="text-patient-page-color" @click="triggerFilePdf" />
                    <a @click="triggerFilePdf" class="ml-2" role="button">{{
                         $t(title)
                         }}</a>
                    <action-button-solid v-if="filePdfUploaded" icon="CheckCircleIcon" size="h-6 w-6 mr-1" />
                    <action-button-solid v-if="filePdfUploaded" icon="TrashIcon" size="h-6 w-6 mr-1"
                         color="text-red-500" />

               </div>
          </div>
     </div>
</template>
<script setup>
import ActionButtonSolid from '@components/forms/ActionButtonSolidIcon.vue'
import { ref } from 'vue'

const props = defineProps({
     data: {
          type: [String, File, Object],
          required: false
     },
     title: {
          type: String,
          required: true
     },
     aceptAll: {
          type: Boolean,
          default: false
     },
     currentSelected: {

     }
})

const filePdf = ref(null)
const filePdfUploaded = ref(!!props.data)
const uploadedFile = ref(props.data || null)
const triggerFilePdf = () => {
     filePdf.value.click()
}
const handleFilePdf = (event) => {
     const files = event.target.files;
     if (files.length > 0) {
          filePdfUploaded.value = true
          // emit('sendFiles', files[0])
     } else {
          filePdfUploaded.value = false
     }
};

const isDragging = ref(false)
const onDragOver = () => {
     isDragging.value = true
}

const onDragLeave = () => {
     isDragging.value = false
}
const onDrop = (event) => {
     event.preventDefault()
     const files = event.dataTransfer.files
     if (files.length > 0) {
          filePdfUploaded.value = true
          uploadedFile.value = files[0]
          // emit('sendFiles', uploadedFile.value)
     } else {
          filePdfUploaded.value = false
     }
     isDragging.value = false
}
</script>