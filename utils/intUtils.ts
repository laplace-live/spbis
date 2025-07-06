export function interpretAsSignedType(n: bigint): bigint {
  // see https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wire_format_lite.h#L857-L876
  // however, this is a simpler equivalent formula
  const isEven = (n & 1n) === 0n
  if (isEven) {
    return n / 2n
  } else {
    return -1n * ((n + 1n) / 2n)
  }
}

export function interpretAsTwosComplement(n: bigint, bits: number): bigint {
  const isTwosComplement = n >> BigInt(bits - 1) === 1n
  if (isTwosComplement) {
    return n - (1n << BigInt(bits))
  } else {
    return n
  }
}
