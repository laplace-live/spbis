import React, { Fragment } from 'react'

import { TYPES } from '@/lib/protobufDecoder'
import { DecodeResult, ProtobufPart as ProtobufPartType } from '@/lib/types'

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
  const messageElements = messages.map((messageParts, i) => {
    return messageParts.map((part, j) => {
      return <ProtobufPart key={`${i}-${j}`} part={part} />
    })
  })

  const leftOver = value.leftOver.length ? (
    <div className='bg-fg/5 text-fg/60 mt-4 rounded-md border p-3 font-mono text-sm'>
      Left over bytes: {bufferToPrettyHex(value.leftOver)}
    </div>
  ) : null

  return (
    <Fragment>
      <ProtobufSchemaInference decodeResult={value} />

      {messageElements.map((els, i) => (
        <Table key={`message-${i}`} className='font-mono'>
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
