import React from 'react'

import { TopNavBar } from '@/components/layout/top-navbar/TopNavBar'
import { cn } from '@/lib/utils'

type HeaderProps = React.ComponentPropsWithoutRef<'header'>

function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn('bg-slate-800 text-snow-1 dark:bg-slate-700', className)}
      {...props}
    >
      <TopNavBar />
    </header>
  )
}

export { Header }
