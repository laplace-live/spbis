import { Fragment } from 'react'

import type { DecodeResult, ProtobufPart as ProtobufPartType } from '@/lib/types'

import { TYPES } from '@/lib/protobufDecoder'

import { bufferToPrettyHex } from '@/utils/hex'

import ProtobufPart from '@/components/ProtobufPart'
import ProtobufSchemaInference from '@/components/ProtobufSchemaInference'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function splitDelimitedPartsInMessages(parts: ProtobufPartType[]): ProtobufPartType[][] {
  const messages: ProtobufPartType[][] = []
  let currentMessage: ProtobufPartType[] = []
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].type === TYPES.MSG_LEN_DELIMITER && currentMessage.length > 0) {
      messages.push(currentMessage)
      currentMessage = [parts[i]]
    } else {
      currentMessage.push(parts[i])
    }
  }
  if (currentMessage.length > 0) {
    messages.push(currentMessage)
  }
  return messages
}

interface ProtobufDisplayProps {
  value: DecodeResult
}

function ProtobufDisplay(props: ProtobufDisplayProps) {
  const { value } = props

  const messages = splitDelimitedPartsInMessages(value.parts)
  const messageElements = messages.map(messageParts => {
    return messageParts.map(part => {
      return <ProtobufPart key={part.byteRange.join('-')} part={part} />
    })
  })

  const leftOver = value.leftOver.length ? (
    <div className='mt-4 rounded-md border bg-fg/5 p-3 font-mono text-fg/60 text-sm'>
      Left over bytes: {bufferToPrettyHex(value.leftOver)}
    </div>
  ) : null

  return (
    <Fragment>
      <ProtobufSchemaInference decodeResult={value} />

      {messageElements.map((els, i) => (
        <Table key={`message-${messages[i][0].byteRange.join('-')}`} className='font-mono'>
          <TableHeader>
            <TableRow>
              <TableHead>Byte Range</TableHead>
              <TableHead>Field Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{els}</TableBody>
        </Table>
      ))}

      {leftOver}
    </Fragment>
  )
}

export default ProtobufDisplay
