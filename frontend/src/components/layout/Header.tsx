import React from 'react'

import { TopNavBar } from '@/components/layout/top-nav-bar/TopNavBar'
import { cn } from '@/lib/utils'

type HeaderProps = React.ComponentPropsWithoutRef<'header'>

function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn('dark:bg-night-2 bg-slate-800 text-snow-1', className)}
      {...props}
    >
      <TopNavBar />
    </header>
  )
}

export { Header }
