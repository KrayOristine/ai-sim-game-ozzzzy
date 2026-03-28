import pako from "pako";

const tex = new TextEncoder();
const dex = new TextDecoder();

export function compress(data: string) {
  const arr = new Uint8Array(data.length * 3);

  tex.encodeInto(data, arr);

  const compressed = pako.deflate(arr, {
    level: 9,
    memLevel: 8,
    windowBits: 15,
  });

  return compressed.toBase64();
}

/**
 *
 * @param data Must be the value returned from compress
 * @returns
 */
export function decompress(data: string) {
  const arr = Uint8Array.fromBase64(data);

  const decompressed = pako.inflate(arr);

  return decompressed.toString();
}
