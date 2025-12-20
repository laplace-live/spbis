import type { DecodedValue } from '@/lib/types'

import { bufferLeToBeHex, bufferToPrettyHex } from '@/utils/hex'
import { interpretAsSignedType, interpretAsTwosComplement } from '@/utils/intUtils'

export function decodeFixed32(value: Buffer): DecodedValue[] {
  const floatValue = value.readFloatLE(0)
  const intValue = value.readInt32LE(0)
  const uintValue = value.readUInt32LE(0)

  const result: DecodedValue[] = []

  result.push({ type: 'int', value: intValue })

  if (intValue !== uintValue) {
    result.push({ type: 'uint', value: uintValue })
  }

  result.push({ type: 'float', value: floatValue })

  return result
}

export function decodeFixed64(value: Buffer): DecodedValue[] {
  const floatValue = value.readDoubleLE(0)
  const uintValue = BigInt(`0x${bufferLeToBeHex(value)}`)
  const intValue = interpretAsTwosComplement(uintValue, 64)

  const result: DecodedValue[] = []

  result.push({ type: 'int', value: intValue.toString() })

  if (intValue !== uintValue) {
    result.push({ type: 'uint', value: uintValue.toString() })
  }

  result.push({ type: 'double', value: floatValue })

  return result
}

export function decodeVarintParts(value: string): DecodedValue[] {
  const result: DecodedValue[] = []
  const uintVal = BigInt(value)
  result.push({ type: 'uint', value: uintVal.toString() })

  for (const bits of [8, 16, 32, 64]) {
    const intVal = interpretAsTwosComplement(uintVal, bits)
    if (intVal !== uintVal) {
      result.push({ type: `int${bits}`, value: intVal.toString() })
    }
  }

  const signedIntVal = interpretAsSignedType(uintVal)
  if (signedIntVal !== uintVal) {
    result.push({ type: 'sint', value: signedIntVal.toString() })
  }

  return result
}

export function decodeStringOrBytes(value: Buffer): DecodedValue {
  if (!value.length) {
    return { type: 'string|bytes', value: '' }
  }
  const td = new TextDecoder('utf-8', { fatal: true })
  try {
    return { type: 'string', value: td.decode(value) }
  } catch {
    return { type: 'bytes', value: bufferToPrettyHex(value) }
  }
}
