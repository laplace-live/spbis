import type { VarintDecodeResult } from '@/lib/types'

export function decodeVarint(buffer: Buffer, offset: number): VarintDecodeResult {
  let res = 0n
  let shift = 0
  let byte = 0

  do {
    if (offset >= buffer.length) {
      throw new RangeError('Index out of bound decoding varint')
    }

    byte = buffer[offset++]

    const multiplier = 2n ** BigInt(shift)
    const thisByteValue = BigInt(byte & 0x7f) * multiplier
    shift += 7
    res = res + thisByteValue
  } while (byte >= 0x80)

  return {
    value: res,
    length: shift / 7,
  }
}
