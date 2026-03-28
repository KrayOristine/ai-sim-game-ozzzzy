import xxhashwat from "xxhash-wasm";
import type { XXHashAPI } from "xxhash-wasm";

const CACHE: { xxh: XXHashAPI; init: boolean } = {
  xxh: null,
  init: false,
};

export const HashSmallSeed = 942569038;
export const HashBigSeed = 17744692896053305402n;

export async function prepareHasher() {
  if (CACHE.init) {
    return;
  }

  console.time("XXHash Initalization");
  xxhashwat().then((hasher) => {
    CACHE.xxh = hasher;
    CACHE.init = true;

    console.timeEnd("XXHash Initalization");
  });
}

export function Bigint2Hex(hashResult: bigint, removePrefix: boolean = true) {
  const str = hashResult.toString(16);

  if (removePrefix) str.replace(/^0x/i, "");

  return str;
}

export function Bigint2Base64(hashResult: bigint) {
  return hashResult.toString(64);
}

export function getHasher(): XXHashAPI {
  if (CACHE.init) {
    return CACHE.xxh;
  }

  throw new Error("HASHING MODULES DID NOT INITIALIZED");
}
