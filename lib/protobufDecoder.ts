import { type DecodeResult, type ProtobufPart, TYPES, type WireType } from '@/lib/types'

import { decodeVarint } from '@/utils/varintUtils'

class BufferReader {
  buffer: Buffer
  offset: number
  savedOffset: number = 0

  constructor(buffer: Buffer) {
    this.buffer = buffer
    this.offset = 0
  }

  readVarInt() {
    const result = decodeVarint(this.buffer, this.offset)
    this.offset += result.length

    return result.value
  }

  readBuffer(length: number) {
    this.checkByte(length)
    const result = this.buffer.subarray(this.offset, this.offset + length)
    this.offset += length

    return result
  }

  // gRPC has some additional header - remove it
  trySkipGrpcHeader() {
    const backupOffset = this.offset

    if (this.buffer[this.offset] === 0 && this.leftBytes() >= 5) {
      this.offset++
      const length = this.buffer.readInt32BE(this.offset)
      this.offset += 4

      if (length > this.leftBytes()) {
        // Something is wrong, revert
        this.offset = backupOffset
      }
    }
  }

  leftBytes() {
    return this.buffer.length - this.offset
  }

  checkByte(length: number) {
    const bytesAvailable = this.leftBytes()
    if (length > bytesAvailable) {
      throw new Error(`Not enough bytes left. Requested: ${length} left: ${bytesAvailable}`)
    }
  }

  checkpoint() {
    this.savedOffset = this.offset
  }

  resetToCheckpoint() {
    this.offset = this.savedOffset
  }
}

export { TYPES }

export function decodeProto(buffer: Buffer, parseDelimited?: boolean): DecodeResult {
  const reader = new BufferReader(buffer)
  const parts: ProtobufPart[] = []

  reader.trySkipGrpcHeader()

  let protoBufMsgLength = 0
  let protoBufMsgEnd = 0

  try {
    while (reader.leftBytes() > 0) {
      reader.checkpoint()

      if (parseDelimited && protoBufMsgEnd === reader.offset) {
        const byteRange = [reader.offset]
        protoBufMsgLength = Number(reader.readVarInt())
        protoBufMsgEnd = reader.offset + protoBufMsgLength
        byteRange.push(reader.offset)
        parts.push({
          byteRange,
          index: -1,
          type: TYPES.MSG_LEN_DELIMITER,
          value: protoBufMsgLength,
        })
      }

      const byteRange = [reader.offset]
      const indexType = Number(reader.readVarInt())
      const type = indexType & 0b111
      const index = indexType >> 3

      let value: string | Buffer | number
      if (type === TYPES.VARINT) {
        value = reader.readVarInt().toString()
      } else if (type === TYPES.LENDELIM) {
        const length = Number(reader.readVarInt())
        value = reader.readBuffer(length)
      } else if (type === TYPES.FIXED32) {
        value = reader.readBuffer(4)
      } else if (type === TYPES.FIXED64) {
        value = reader.readBuffer(8)
      } else {
        throw new Error(`Unknown type: ${type}`)
      }
      byteRange.push(reader.offset)

      parts.push({
        byteRange,
        index,
        type: type satisfies WireType,
        value,
      })
    }
  } catch (err) {
    console.log(err)
    reader.resetToCheckpoint()
  }

  return {
    parts,
    leftOver: reader.readBuffer(reader.leftBytes()),
  }
}

export function typeToString(type: number, subType?: string): string {
  switch (type) {
    case TYPES.VARINT:
      return 'varint'
    case TYPES.LENDELIM:
      return subType || 'len_delim'
    case TYPES.FIXED32:
      return 'fixed32'
    case TYPES.FIXED64:
      return 'fixed64'
    case TYPES.MSG_LEN_DELIMITER:
      return 'Message delimiter'
    default:
      return 'unknown'
  }
}
