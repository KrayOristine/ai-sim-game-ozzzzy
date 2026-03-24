

export function randomBigInt(bits: number) {
	if (bits < 0)
		throw new RangeError('bits < 0')

  //@ts-expect-error
	const n = (bits >>> 3) + !!(bits & 7) // Round up to next byte.
	const r = 8*n - bits
	const s = 8 - r
	const m = (1 << s) - 1 // Bits to mask off from MSB.

  const arr = new Uint8Array(n);


	const bytes = crypto.getRandomValues(arr)

	maskbits(m, bytes)

	return bytes2bigint(bytes)
}

// Note: mutates the contents of |bytes|.
function maskbits(m: number, bytes: Uint8Array) {
	// Mask off bits from the MSB that are > log2(bits).
	// |bytes| is treated as a big-endian bigint so byte 0 is the MSB.
	if (bytes.length > 0)
		bytes[0] &= m
}

function bytes2bigint(bytes: Uint8Array) {
	let result = 0n

	const n = bytes.length

	// Read input in 8 byte slices. This is, on average and at the time
	// of writing, about 35x faster for large inputs than processing them
	// one byte at a time.
	if (n >= 8) {
		const view = new DataView(bytes.buffer, bytes.byteOffset)

		for (let i = 0, k = n & ~7; i < k; i += 8) {
			const x = view.getBigUint64(i, false)
			result = (result << 64n) + x
		}
	}

	// Now mop up any remaining bytes.
	for (let i = n & ~7; i < n; i++)
		result = result * 256n + BigInt(bytes[i])

	return result
}