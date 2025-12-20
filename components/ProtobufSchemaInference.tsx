import type { DecodeResult } from '@/lib/types'

import { generateProtoFile } from '@/lib/schemaInference'

interface ProtobufSchemaInferenceProps {
  decodeResult: DecodeResult
}

function ProtobufSchemaInference({ decodeResult }: ProtobufSchemaInferenceProps) {
  const schema = generateProtoFile(decodeResult)

  return (
    <div className='mb-2 space-y-2'>
      <h3 className='font-medium text-fg/80 text-sm'>Inferred Protobuf Schema</h3>
      <pre className='overflow-auto rounded-md border border-fg/30 bg-fg/5 p-3 text-sm shadow-xs'>
        <code className='language-protobuf'>{schema}</code>
      </pre>
    </div>
  )
}

export default ProtobufSchemaInference
