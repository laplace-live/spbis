'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import type * as React from 'react'

import { cn } from '@/lib/cn'

function Separator({
  className,
  orientation = 'horizontal',
  extended = false,
  position = 'start',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  extended?: boolean
  position?: 'center' | 'start' | 'end'
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      data-extended={extended}
      data-position={position}
      className={cn(
        'relative flex items-center gap-1.5 whitespace-nowrap text-xs',

        // Horizontal mode needs to support inline text, use pseudo elements for lines
        'data-[orientation=horizontal]:after:bg-fg/20 data-[orientation=horizontal]:after:content-[""]',
        'data-[orientation=horizontal]:after:h-px data-[orientation=horizontal]:after:w-full',
        'data-[orientation=horizontal]:before:bg-fg/20 data-[orientation=horizontal]:before:content-[""]',
        'data-[orientation=horizontal]:before:h-px data-[orientation=horizontal]:before:w-full',

        // Extended mode
        // extended && 'before:border-t-fg/20 before:w-2.5 before:border-t before:content-[""]',
        'data-[extended=true]:data-[position=start]:data-[orientation=horizontal]:before:w-2.5',
        'data-[extended=true]:data-[position=end]:data-[orientation=horizontal]:after:w-2.5',

        // Positions
        'data-[extended=false]:data-[position=end]:data-[orientation=horizontal]:after:hidden',
        'data-[extended=false]:data-[position=start]:data-[orientation=horizontal]:before:hidden',

        // Vertical mode does not need to support inline text, use background color instead
        'data-[orientation=vertical]:bg-fg/20',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
