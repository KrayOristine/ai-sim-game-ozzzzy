import pako from "pako";

export function compress(data: string) {
  const arr = new Uint8Array(Buffer.from(data, "utf-8"));

  const compressed = pako.deflate(arr, {
    level: 9,
    memLevel: 8,
    windowBits: 15,
  });

  return Buffer.from(compressed).toString("base64");
}

/**
 *
 * @param data Must be the value returned from compress
 * @returns
 */
export function decompress(data: string) {
  const arr = new Uint8Array(Buffer.from(data, "base64"));

  const decompressed = pako.inflate(arr);

  return Buffer.from(decompressed).toString("utf-8");
}
