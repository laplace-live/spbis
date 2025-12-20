'use client'

import { useState } from 'react'

import { decodeProto } from '@/lib/protobufDecoder'

import { bufferToPrettyHex, parseInput } from '@/utils/hex'

import ProtobufDisplay from '@/components/ProtobufDisplay'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

export default function Home() {
  const [hex, setHex] = useState('')
  const [hexBuffer, setHexBuffer] = useState<Buffer | null>(null)
  const [parseDelimited, setParseDelimited] = useState(false)

  const onDemoData = () => {
    setHex(
      '1d 08 01 12 19 0a 17 41 63 74 69 6f 6e 52 65 61 63 74 69 6f 6e 54 65 73 74 53 75 69 74 65 07 08 03 1a 03 0a 01 01 07 08 03 1a 03 0a 01 00 0a 08 04 22 06 10 02 18 08 20 01 07 08 03 1a 03 0a 01 02 07 08 03 1a 03 0a 01 02 0a 08 04 22 06 10 02 18 01 20 01 07 08 03 1a 03 0a 01 04 0f 08 04 22 0b 10 02 18 09 20 01 7a 82 00 08 01 07 08 03 1a 03 0a 01 06 07 08 03 1a 03 0a 01 06 0f 08 04 22 0b 10 02 18 02 20 01 7a 82 00 08 00 07 08 03 1a 03 0a 01 08 0f 08 04 22 0b 10 02 18 0a 20 01 7a 82 00 08 02 07 08 03 1a 03 0a 01 0a 07 08 03 1a 03 0a 01 0a 0f 08 04 22 0b 10 02 18 03 20 01 7a 82 00 08 04 07 08 03 1a 03 0a 01 0c 08 08 04 22 04 18 01 20 01 07 08 03 1a 03 0a 01 0e 07 08 03 1a 03 0a 01 0e 08 08 04 22 04 18 08 20 01 07 08 03 1a 03 0a 01 10 0d 08 04 22 09 18 02 20 01 7a 82 00 08 00 07 08 03 1a 03 0a 01 12 07 08 03 1a 03 0a 01 12 0d 08 04 22 09 18 09 20 01 7a 82 00 08 01 07 08 03 1a 03 0a 01 14 0d 08 04 22 09 18 03 20 01 7a 82 00 08 04 07 08 03 1a 03 0a 01 16 07 08 03 1a 03 0a 01 16 0d 08 04 22 09 18 0a 20 01 7a 82 00 08 06 07 08 03 1a 03 0a 01 18 02 08 02 1f 08 01 12 1b 0a 17 41 63 74 69 6f 6e 52 65 61 63 74 69 6f 6e 54 65 73 74 53 75 69 74 65 10 01 07 08 03 1a 03 0a 01 01 07 08 03 1a 03 0a 01 00 0a 08 04 22 06 10 02 18 08 20 01 0f 08 04 22 0b 10 02 18 09 20 01 7a 82 00 08 01 0f 08 04 22 0b 10 02 18 0a 20 01 7a 82 00 08 02 08 08 04 22 04 18 01 20 01 0d 08 04 22 09 18 02 20 01 7a 82 00 08 00 0d 08 04 22 09 18 03 20 01 7a 82 00 08 04 07 08 03 1a 03 0a 01 02 07 08 03 1a 03 0a 01 02 0a 08 04 22 06 10 02 18 01 20 01 07 08 03 1a 03 0a 01 04 07 08 03 1a 03 0a 01 04 0f 08 04 22 0b 10 02 18 02 20 01 7a 82 00 08 00 07 08 03 1a 03 0a 01 06 07 08 03 1a 03 0a 01 06 0f 08 04 22 0b 10 02 18 03 20 01 7a 82 00 08 04 07 08 03 1a 03 0a 01 08 07 08 03 1a 03 0a 01 08 08 08 04 22 04 18 08 20 01 07 08 03 1a 03 0a 01 0a 07 08 03'
    )
  }

  const onHexChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHex(e.target.value)
  }

  const onSubmit = () => {
    const buffer = parseInput(hex)

    // Set pretty hex back to UI
    setHex(bufferToPrettyHex(buffer))

    // Set to hexBuffer which will be sent to render
    setHexBuffer(buffer)
  }

  return (
    <div className='space-y-3 p-4'>
      <h1 className='font-bold text-2xl'>LAPLACE SPBIS</h1>

      <p>
        Schemaless Protocol Buffers Inspecting System.{' '}
        <a href='https://github.com/laplace-live/spbis' className='text-ac'>
          View Source
        </a>
      </p>

      <Textarea
        placeholder='Paste Protobuf or gRPC request as hex or base64'
        onChange={onHexChanged}
        value={hex}
        className='font-mono'
      />

      <Field orientation='horizontal'>
        <Checkbox
          id='parse-delimited'
          checked={parseDelimited}
          onCheckedChange={value => setParseDelimited(value === true)}
        />
        <FieldLabel htmlFor='parse-delimited'>Parse varint length delimited input</FieldLabel>
      </Field>

      <div className='flex gap-2'>
        <Button onClick={onSubmit} variant={'solid'} tint={'accent'}>
          Decode
        </Button>

        <Button onClick={onDemoData}>Demo Data</Button>
      </div>

      {hexBuffer && <ProtobufDisplay value={decodeProto(hexBuffer, parseDelimited)} />}
    </div>
  )
}
