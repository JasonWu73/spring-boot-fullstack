import React from 'react'

import { TopNavbar } from '@/shared/components/layout/TopNavbar'
import { cn } from '@/shared/utils/helpers'

type HeaderProps = React.ComponentPropsWithoutRef<'header'>

export function Header({
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      {...props}
      className={cn(
        'border-b border-one-dark-2 text-slate-50 bg-one-dark-1 shadow-sm shadow-one-dark-1',
        className
      )}
    >
      <TopNavbar/>
    </header>
  )
}
