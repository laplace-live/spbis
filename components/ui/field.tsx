'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { useMemo } from 'react'

import { cn } from '@/lib/cn'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot='field-set'
      className={cn(
        'flex flex-col gap-4',
        'has-[>[data-slot=checkbox-group]]:gap-2 has-[>[data-slot=radio-group]]:gap-2',
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot='field-legend'
      data-variant={variant}
      className={cn('mb-3 font-medium', 'data-[variant=legend]:text-base', 'data-[variant=label]:text-sm', className)}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='field-group'
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-4 data-[slot=checkbox-group]:gap-2 [&>[data-slot=field-group]]:gap-3',
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva('group/field flex w-full gap-1.5 data-[invalid=true]:text-destructive', {
  variants: {
    orientation: {
      vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
      horizontal: [
        'w-fit flex-row items-center',

        // Making gap of inline checkboxes and radios clickable
        'has-[>[data-slot=radio-group-item]+[data-slot=field-label]]:gap-0 [&>[data-slot=radio-group-item]+[data-slot=field-label]]:pl-1.5',
        'has-[>[data-slot=checkbox]+[data-slot=field-label]]:gap-0 [&>[data-slot=checkbox]+[data-slot=field-label]]:pl-1.5',
        'has-[>[data-slot=switch]+[data-slot=field-label]]:gap-0 [&>[data-slot=switch]+[data-slot=field-label]]:pl-1.5',

        '[&>[data-slot=field-label]]:flex-auto',
        'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      ],
      responsive: [
        '@md/field-group:flex-row flex-col @md/field-group:items-center @md/field-group:[&>*]:w-auto [&>*]:w-full [&>.sr-only]:w-auto',
        '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
        '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      ],
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: legit role
    <div
      role='group'
      data-slot='field'
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='field-content'
      className={cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot='field-label'
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-1 leading-snug group-data-[disabled=true]/field:opacity-50',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-fg/30 [&>*]:data-[slot=field]:p-4',
        'has-data-[state=checked]:has-[>[data-slot=field]]:border-ac has-data-[state=checked]:border-ac has-data-[state=checked]:bg-ac/5',
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='field-label'
      className={cn(
        'flex w-fit items-center gap-2 font-medium text-sm leading-snug group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot='field-description'
      className={cn(
        'font-normal text-fg/60 text-sm leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
        'nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5',
        '[&>a:hover]:text-fg [&>a]:underline [&>a]:underline-offset-2',
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  children?: React.ReactNode
}) {
  return (
    <Separator data-slot='field-separator' data-content={!!children} className={cn(className)} {...props}>
      {children}
    </Separator>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    if (errors?.length === 1) {
      return errors[0]?.message
    }

    return (
      <ul className='ml-4 flex list-disc flex-col gap-1'>
        {errors.map((error, index) => error?.message && <li key={`${index}-${error.message}`}>{error.message}</li>)}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div role='alert' data-slot='field-error' className={cn('font-normal text-rose-500 text-sm', className)} {...props}>
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
