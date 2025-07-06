import React from 'react'

import { decodeProto, TYPES, typeToString } from '@/lib/protobufDecoder'
import { decodeFixed32, decodeFixed64, decodeStringOrBytes, decodeVarintParts } from '@/lib/protobufPartDecoder'
import { ProtobufPart as ProtobufPartType } from '@/lib/types'

import ProtobufDisplay from '@/components/ProtobufDisplay'
import { TableCell, TableRow } from '@/components/ui/table'

interface ProtobufVarintPartProps {
  value: string
}

function ProtobufVarintPart(props: ProtobufVarintPartProps) {
  const { value } = props
  const decoded = decodeVarintParts(value)

  return (
    <>
      {decoded.map((d, i) => (
        <span key={i}>
          As {d.type}: {d.value}
          <br />
        </span>
      ))}
    </>
  )
}

interface ProtobufStringOrBytesPartProps {
  value: { type: string; value: string | number }
}

function ProtobufStringOrBytesPart(props: ProtobufStringOrBytesPartProps) {
  const { value } = props
  return <>{value.value}</>
}

interface ProtobufFixed64PartProps {
  value: Buffer
}

function ProtobufFixed64Part(props: ProtobufFixed64PartProps) {
  const { value } = props
  const decoded = decodeFixed64(value)

  return (
    <>
      {decoded.map((d, i) => (
        <span key={i}>
          As {d.type}: {d.value}
          <br />
        </span>
      ))}
    </>
  )
}

interface ProtobufFixed32PartProps {
  value: Buffer
}

function ProtobufFixed32Part(props: ProtobufFixed32PartProps) {
  const { value } = props
  const decoded = decodeFixed32(value)

  return (
    <>
      {decoded.map((d, i) => (
        <span key={i}>
          As {d.type}: {d.value}
          <br />
        </span>
      ))}
    </>
  )
}

function getProtobufPart(part: ProtobufPartType): [React.ReactNode, string?] {
  switch (part.type) {
    case TYPES.VARINT:
      if (typeof part.value === 'string') {
        return [<ProtobufVarintPart key='varint' value={part.value} />]
      }
      return ['Invalid varint value']
    case TYPES.LENDELIM:
      if (Buffer.isBuffer(part.value)) {
        // TODO: Support repeated field
        const decoded = decodeProto(part.value)
        if (part.value.length > 0 && decoded.leftOver.length === 0) {
          return [<ProtobufDisplay key='protobuf' value={decoded} />, 'protobuf']
        } else {
          const decodedString = decodeStringOrBytes(part.value)
          return [<ProtobufStringOrBytesPart key='string-bytes' value={decodedString} />, decodedString.type]
        }
      }
      return ['Invalid length-delimited value']
    case TYPES.FIXED64:
      if (Buffer.isBuffer(part.value)) {
        return [<ProtobufFixed64Part key='fixed64' value={part.value} />]
      }
      return ['Invalid fixed64 value']
    case TYPES.FIXED32:
      if (Buffer.isBuffer(part.value)) {
        return [<ProtobufFixed32Part key='fixed32' value={part.value} />]
      }
      return ['Invalid fixed32 value']
    case TYPES.MSG_LEN_DELIMITER:
      return ['Message length: ' + part.value + ' bytes']
    default:
      return ['Unknown type']
  }
}

interface ProtobufPartProps {
  part: ProtobufPartType
}

function ProtobufPart(props: ProtobufPartProps) {
  const { part } = props

  const [contents, subType] = getProtobufPart(part)
  const stringType = typeToString(part.type, subType)

  return (
    <TableRow>
      <TableCell className='text-fg/60'>{part.byteRange.join('-')}</TableCell>
      <TableCell className='font-semibold'>{part.index}</TableCell>
      <TableCell className='font-medium'>{stringType}</TableCell>
      <TableCell className='break-all'>{contents}</TableCell>
    </TableRow>
  )
}

export default ProtobufPart
