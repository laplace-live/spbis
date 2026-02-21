import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

const badgeVariantsConfig = {
  size: {
    default: 'text-xs px-2.5 py-0.5 leading-tight',
    lg: 'text-sm px-3 py-0.5 leading-tight',
    sm: 'text-[10px] px-1.5 py-[0.1rem] leading-none',
  },
  variant: {
    default: '',
    solid: '',
    // TODO: Implement gradient variant
    gradient: '',
    dot: 'relative',
  },
  tint: {
    default: 'bg-gray-500/10 text-gray-500',
    accent: 'bg-ac/10 text-ac',
    red: 'bg-red-500/10 text-red-500',
    orange: 'bg-orange-500/10 text-orange-500',
    amber: 'bg-amber-500/10 text-amber-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    lime: 'bg-lime-500/10 text-lime-500',
    green: 'bg-green-500/10 text-green-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    teal: 'bg-teal-500/10 text-teal-500',
    cyan: 'bg-cyan-500/10 text-cyan-500',
    sky: 'bg-sky-500/10 text-sky-500',
    blue: 'bg-blue-500/10 text-blue-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
    violet: 'bg-violet-500/10 text-violet-500',
    purple: 'bg-purple-500/10 text-purple-500',
    fuchsia: 'bg-fuchsia-500/10 text-fuchsia-500',
    pink: 'bg-pink-500/10 text-pink-500',
    rose: 'bg-rose-500/10 text-rose-500',
    dark: 'bg-fg/10 text-fg',
    white: 'bg-white/10 text-white',
    black: 'bg-black/10 text-black',
  },
  radius: {
    default: 'rounded-full',
    lg: 'rounded-lg',
    md: 'rounded-md',
    sm: 'rounded-xs',
    none: 'rounded-none',
  },
  border: {
    default: 'border',
    none: 'border-transparent',
  },
}

const dotVariants = cva('absolute top-1/2 -translate-y-1/2 rounded-full', {
  variants: {
    size: {
      default: 'left-1.5 size-2',
      lg: 'left-1.5 size-2',
      sm: 'left-1 size-1.5',
    },
    tint: {
      default: 'bg-gray-500',
      accent: 'bg-ac',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      amber: 'bg-amber-500',
      yellow: 'bg-yellow-500',
      lime: 'bg-lime-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500',
      teal: 'bg-teal-500',
      cyan: 'bg-cyan-500',
      sky: 'bg-sky-500',
      blue: 'bg-blue-500',
      indigo: 'bg-indigo-500',
      violet: 'bg-violet-500',
      purple: 'bg-purple-500',
      fuchsia: 'bg-fuchsia-500',
      pink: 'bg-pink-500',
      rose: 'bg-rose-500',
      dark: 'bg-fg',
      white: 'bg-white',
      black: 'bg-black',
    },
  },
  defaultVariants: {
    size: 'default',
    tint: 'default',
  },
})

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border border-current border-solid font-medium uppercase',
  {
    variants: badgeVariantsConfig,
    compoundVariants: [
      { variant: 'solid', tint: 'default', className: 'border-gray-500 bg-gray-500 text-bg' },
      { variant: 'solid', tint: 'accent', className: 'border-ac bg-ac text-bg' },
      { variant: 'solid', tint: 'red', className: 'border-red-500 bg-red-500 text-bg' },
      { variant: 'solid', tint: 'orange', className: 'border-orange-500 bg-orange-500 text-bg' },
      { variant: 'solid', tint: 'amber', className: 'border-amber-500 bg-amber-500 text-bg' },
      { variant: 'solid', tint: 'yellow', className: 'border-yellow-500 bg-yellow-500 text-bg' },
      { variant: 'solid', tint: 'lime', className: 'border-lime-500 bg-lime-500 text-bg' },
      { variant: 'solid', tint: 'green', className: 'border-green-500 bg-green-500 text-bg' },
      { variant: 'solid', tint: 'emerald', className: 'border-emerald-500 bg-emerald-500 text-bg' },
      { variant: 'solid', tint: 'teal', className: 'border-teal-500 bg-teal-500 text-bg' },
      { variant: 'solid', tint: 'cyan', className: 'border-cyan-500 bg-cyan-500 text-bg' },
      { variant: 'solid', tint: 'sky', className: 'border-sky-500 bg-sky-500 text-bg' },
      { variant: 'solid', tint: 'blue', className: 'border-blue-500 bg-blue-500 text-bg' },
      { variant: 'solid', tint: 'indigo', className: 'border-indigo-500 bg-indigo-500 text-bg' },
      { variant: 'solid', tint: 'violet', className: 'border-violet-500 bg-violet-500 text-bg' },
      { variant: 'solid', tint: 'purple', className: 'border-purple-500 bg-purple-500 text-bg' },
      { variant: 'solid', tint: 'fuchsia', className: 'border-fuchsia-500 bg-fuchsia-500 text-bg' },
      { variant: 'solid', tint: 'pink', className: 'border-pink-500 bg-pink-500 text-bg' },
      { variant: 'solid', tint: 'rose', className: 'border-rose-500 bg-rose-500 text-bg' },
      { variant: 'solid', tint: 'dark', className: 'border-fg bg-fg text-bg' },
      { variant: 'solid', tint: 'white', className: 'border-white bg-white text-black' },
      { variant: 'solid', tint: 'black', className: 'border-black bg-black text-white' },

      // Dot variant padding adjustments
      { variant: 'dot', size: 'default', className: 'pl-4.5' },
      { variant: 'dot', size: 'sm', className: 'pl-[0.85rem]' },
      { variant: 'dot', size: 'lg', className: 'pl-5' },
    ],
    defaultVariants: {
      size: 'default',
      variant: 'default',
      tint: 'default',
      radius: 'default',
      border: 'default',
    },
  }
)

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  /**
   * @link https://www.radix-ui.com/primitives/docs/utilities/slot
   */
  asChild?: boolean
}

function Badge({
  size,
  className,
  asChild = false,
  tint = 'default',
  variant,
  radius,
  border,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'div'

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ size, variant, tint, radius, border }), className)}
      {...props}
    >
      {variant === 'dot' && <span className={dotVariants({ size, tint })} />}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  )
}

export { Badge, badgeVariants, badgeVariantsConfig, dotVariants }
