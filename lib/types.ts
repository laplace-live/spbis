// Protobuf wire types
export const TYPES = {
  MSG_LEN_DELIMITER: -1,
  VARINT: 0,
  FIXED64: 1,
  LENDELIM: 2,
  FIXED32: 5,
} as const

export type WireType = (typeof TYPES)[keyof typeof TYPES]

// Decoded value types
export interface DecodedValue {
  type: string
  value: string | number
}

// Protobuf part structure
export interface ProtobufPart {
  byteRange: number[]
  index: number
  type: WireType
  value: string | Buffer | number
}

// Decode result structure
export interface DecodeResult {
  parts: ProtobufPart[]
  leftOver: Buffer
}

// Varint decode result
export interface VarintDecodeResult {
  value: bigint
  length: number
}
