'use client'

import { useState } from 'react'

import { decodeProto } from '@/lib/protobufDecoder'

import { bufferToPrettyHex, parseInput } from '@/utils/hex'

import ProtobufDisplay from '@/components/ProtobufDisplay'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function Home() {
  const [hex, setHex] = useState('')
  const [hexBuffer, setHexBuffer] = useState<Buffer | null>(null)
  const [parseDelimited] = useState(false)

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

      <Button onClick={onSubmit}>Decode</Button>

      {hexBuffer && <ProtobufDisplay value={decodeProto(hexBuffer, parseDelimited)} />}
    </div>
  )
}
