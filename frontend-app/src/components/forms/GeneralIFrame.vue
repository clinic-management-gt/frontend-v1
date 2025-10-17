<template>
  <div class="flex flex-col w-full">
    <div>
      <iframe
        v-if="blobUrl"
        :src="blobUrl"
        frameborder="0"
        :width="customWidth"
        :height="customHeight"
      ></iframe>
    </div>
    <div class="block sm:hidden mt-4">
      <primary-button @click="downloadPdf">
        <div class="uppercase">
          {{ $t("general.download-pdf") }}
        </div>
      </primary-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useBlobAdapter } from "@/composables/useBlobAdapter";
import PrimaryButton from "@components/forms/PrimaryButton.vue";

const props = defineProps({
  source: { type: [String, Blob, File, ArrayBuffer, Uint8Array], required: true },
  width: { type: String, default: "100%" },
  height: { type: String, default: "900px" },
});

const { blobUrl, generate } = useBlobAdapter(props.source, {
  mimeType: "application/pdf",
});

onMounted(generate);

function downloadPdf() {
  if (!blobUrl.value) return;
  const link = document.createElement("a");
  link.href = blobUrl.value;
  link.download = "document.pdf";
  link.click();
}

const customWidth = computed(() => props.width);
const customHeight = computed(() => props.height);
</script>
