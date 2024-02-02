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
        'text-slate-200 bg-one-dark-1 border-b border-one-dark-2 shadow-sm shadow-one-dark-1',
        className
      )}
    >
      <TopNavbar/>
    </header>
  )
}
