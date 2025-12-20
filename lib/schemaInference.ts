import type { DecodeResult, ProtobufPart } from '@/lib/types'

import { decodeProto, TYPES } from '@/lib/protobufDecoder'

interface FieldInfo {
  fieldNumber: number
  wireType: number
  inferredType: string
  repeated: boolean
  nested?: DecodeResult
}

export function inferProtobufSchema(decodeResult: DecodeResult): string {
  const fieldMap = new Map<number, FieldInfo>()

  // Analyze all parts to build field information
  for (const part of decodeResult.parts) {
    if (part.type === TYPES.MSG_LEN_DELIMITER) continue

    const existingField = fieldMap.get(part.index)
    if (existingField) {
      // Field appears multiple times, mark as repeated
      existingField.repeated = true
    } else {
      const fieldInfo: FieldInfo = {
        fieldNumber: part.index,
        wireType: part.type,
        inferredType: inferFieldType(part),
        repeated: false,
      }

      // If it's a nested message, decode it
      if (part.type === TYPES.LENDELIM && Buffer.isBuffer(part.value)) {
        try {
          const nestedResult = decodeProto(part.value)
          if (nestedResult.leftOver.length === 0 && nestedResult.parts.length > 0) {
            fieldInfo.nested = nestedResult
            fieldInfo.inferredType = `Message${part.index}`
          }
        } catch {
          // Not a valid nested message, keep original type
        }
      }

      fieldMap.set(part.index, fieldInfo)
    }
  }

  // Generate proto schema
  const schema = generateProtoSchema(fieldMap)
  return schema
}

function inferFieldType(part: ProtobufPart): string {
  switch (part.type) {
    case TYPES.VARINT:
      // Could be int32, int64, uint32, uint64, sint32, sint64, bool, enum
      // Default to int64 as it's most general
      if (typeof part.value === 'string') {
        const value = BigInt(part.value)
        if (value === 0n || value === 1n) {
          return 'bool' // Likely a boolean if 0 or 1
        }
      }
      return 'int64'

    case TYPES.FIXED64:
      return 'fixed64' // Could also be sfixed64 or double

    case TYPES.LENDELIM:
      if (Buffer.isBuffer(part.value)) {
        // Try to decode as string
        try {
          const td = new TextDecoder('utf-8', { fatal: true })
          td.decode(part.value)
          return 'string'
        } catch {
          return 'bytes'
        }
      }
      return 'bytes'

    case TYPES.FIXED32:
      return 'fixed32' // Could also be sfixed32 or float

    default:
      return 'unknown'
  }
}

function generateProtoSchema(
  fieldMap: Map<number, FieldInfo>,
  messageName: string = 'Message',
  indent: number = 0
): string {
  const indentStr = '  '.repeat(indent)
  const lines: string[] = []

  lines.push(`${indentStr}message ${messageName} {`)

  // Sort fields by field number
  const sortedFields = Array.from(fieldMap.entries()).sort((a, b) => a[0] - b[0])

  for (const [fieldNumber, fieldInfo] of sortedFields) {
    const fieldPrefix = fieldInfo.repeated ? 'repeated ' : ''

    if (fieldInfo.nested) {
      // Generate nested message
      const nestedSchema = generateProtoSchemaFromResult(fieldInfo.nested, fieldInfo.inferredType, indent + 1)
      lines.push(nestedSchema)
      lines.push(`${indentStr}  ${fieldPrefix}${fieldInfo.inferredType} field_${fieldNumber} = ${fieldNumber};`)
    } else {
      lines.push(`${indentStr}  ${fieldPrefix}${fieldInfo.inferredType} field_${fieldNumber} = ${fieldNumber};`)
    }
  }

  lines.push(`${indentStr}}`)

  return lines.join('\n')
}

function generateProtoSchemaFromResult(
  decodeResult: DecodeResult,
  messageName: string = 'Message',
  indent: number = 0
): string {
  const fieldMap = new Map<number, FieldInfo>()

  // Build field map from decode result
  for (const part of decodeResult.parts) {
    if (part.type === TYPES.MSG_LEN_DELIMITER) continue

    const existingField = fieldMap.get(part.index)
    if (existingField) {
      existingField.repeated = true
    } else {
      const fieldInfo: FieldInfo = {
        fieldNumber: part.index,
        wireType: part.type,
        inferredType: inferFieldType(part),
        repeated: false,
      }

      if (part.type === TYPES.LENDELIM && Buffer.isBuffer(part.value)) {
        try {
          const nestedResult = decodeProto(part.value)
          if (nestedResult.leftOver.length === 0 && nestedResult.parts.length > 0) {
            fieldInfo.nested = nestedResult
            fieldInfo.inferredType = `Message${part.index}`
          }
        } catch {
          // Not a valid nested message
        }
      }

      fieldMap.set(part.index, fieldInfo)
    }
  }

  return generateProtoSchema(fieldMap, messageName, indent)
}

export function generateProtoFile(decodeResult: DecodeResult): string {
  //   const header = `syntax = "proto3";

  // // This schema is automatically inferred from the decoded protobuf data
  // // Field names are generic (field_1, field_2, etc.) as they cannot be determined from the binary format
  // // Field types are best guesses based on wire types and content analysis

  // `

  const schema = inferProtobufSchema(decodeResult)
  return schema
}
