export class FileAdapter {
  constructor(source, options = {}) {
    this.source = source;
    this.mimeType = options.mimeType || "application/octet-stream";
  }

  async toBlob() {
    const source = this.source;

    // String: data URL, blob URL, base64 "cruda", o URL remota
    if (typeof source === "string") {
      if (source.startsWith("data:")) {
        return this.#fromDataUrl(source);
      } else if (source.startsWith("blob:")) {
        const response = await fetch(source);
        return await response.blob();
      } else if (this.#isBase64(source)) {
        return this.#fromBase64(source, this.mimeType);
      } else {
        // URL http(s)
        const response = await fetch(source);
        return await response.blob();
      }
    }

    // Tipos nativos de navegador
    if (source instanceof Blob || (typeof File !== "undefined" && source instanceof File)) {
      return source;
    }

    if (source instanceof ArrayBuffer || source instanceof Uint8Array) {
      return new Blob([source], { type: this.mimeType });
    }

    throw new Error("Unsupported source type");
  }

  async toBlobUrl() {
    const blob = await this.toBlob();
    return URL.createObjectURL(blob);
  }

  // ---------- privados ----------

  #isBase64(str) {
    // Comprobación prudente: longitud múltiplo de 4 y solo caracteres base64 (+ relleno)
    if (typeof str !== "string" || str.length === 0 || str.length % 4 !== 0) return false;
    return /^[A-Za-z0-9+/]+={0,2}$/.test(str);
  }

  #fromBase64(base64Str, type = "application/octet-stream") {
    const bytes = this.#decodeBase64ToBytes(base64Str);
    return new Blob([bytes], { type });
  }

  #fromDataUrl(dataUrl) {
    const [header, base64Str] = dataUrl.split(",");
    const mimeMatch = header.match(/data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : this.mimeType;
    const bytes = this.#decodeBase64ToBytes(base64Str);
    return new Blob([bytes], { type: mimeType });
  }

  #decodeBase64ToBytes(base64Str) {
    const byteCharacters = atob(base64Str);
    const sliceSize = 512;
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Uint8Array(byteArrays.reduce((acc, arr) => acc + arr.length, 0))
      .map((_, i, out) => {
        // aplanar eficientemente
        let pos = 0;
        for (const arr of byteArrays) {
          out.set(arr, pos);
          pos += arr.length;
        }
        return out[i];
      });
  }
}
