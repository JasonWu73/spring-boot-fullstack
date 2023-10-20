import React from 'react'

import { cn } from '@/lib/utils'
import { SideNavBar } from '@/components/layout/side-navbar/SideNavBar'

type AsideProps = React.ComponentPropsWithoutRef<'header'>

function Aside({ className, ...props }: AsideProps) {
  return (
    <header
      className={cn('bg-slate-800 text-snow-1 dark:bg-slate-700', className)}
      {...props}
    >
      <SideNavBar />
    </header>
  )
}

export { Aside }
