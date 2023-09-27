import React, { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button.ts'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

/**
 * {@link https://ui.shadcn.com/docs/components/button|Button - shadcn/ui}
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }