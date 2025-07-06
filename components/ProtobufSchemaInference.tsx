import React from 'react'

import { generateProtoFile } from '@/lib/schemaInference'
import { DecodeResult } from '@/lib/types'

interface ProtobufSchemaInferenceProps {
  decodeResult: DecodeResult
}

function ProtobufSchemaInference({ decodeResult }: ProtobufSchemaInferenceProps) {
  const schema = generateProtoFile(decodeResult)

  return (
    <div className='mb-2 space-y-2'>
      <h3 className='text-fg/80 text-sm font-medium'>Inferred Protobuf Schema</h3>
      <pre className='bg-fg/5 overflow-auto rounded-md border p-3 text-sm'>
        <code className='language-protobuf'>{schema}</code>
      </pre>
    </div>
  )
}

export default ProtobufSchemaInference
