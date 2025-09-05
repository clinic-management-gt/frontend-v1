import { Blob } from 'buffer';
export class FileAdapter {
  constructor(source, options = {}) {
    this.source = source;
    this.mimeType = options.mimeType || "application/octet-stream";
  }

  async toBlob() {
    const source = this.source;

    if (typeof source === "string") {
      if (source.startsWith("data:")) {
        return this.#fromDataUrl(source);
      } else if (source.startsWith("blob:")) {
        const response = await fetch(source);
        return await response.blob();
      } else if (/^[A-Za-z0-9+/=]+$/.test(source)) {
        return this.#fromBase64(source);
      } else {
        const response = await fetch(source);
        return await response.blob();
      }
    }

    if (source instanceof Blob || source instanceof File) {
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

  #fromBase64(base64Str) {
    const sliceSize = 512;
    const byteCharacters = atob(base64Str);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: this.mimeType });
  }

  #fromDataUrl(dataUrl) {
    const [header, base64Str] = dataUrl.split(",");
    const mimeMatch = header.match(/data:(.*);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : this.mimeType;
    return this.#fromBase64(base64Str).then(
      (blob) => new Blob([blob], { type: mimeType }),
    );
  }
}
