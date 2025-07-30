import { ref } from 'vue'
import { FileAdapter } from '@utils/FileAdapter.js'

export function useBlobAdapter(source, options = {}) {
  const blobUrl = ref(null)
  const blob = ref(null)
  const error = ref(null)

  async function generate() {
    try {
      const adapter = new FileAdapter(source.value ?? source, options)
      blob.value = await adapter.toBlob()
      blobUrl.value = URL.createObjectURL(blob.value)
    } catch (e) {
      error.value = e
    }
  }

  return {
    blob,
    blobUrl,
    error,
    generate
  }
}
