import React from 'react'

import { cn } from '@/lib/utils'
import { SideNavBar } from '@/components/layout/side-nav-bar/SideNavBar'

type AsideProps = React.ComponentPropsWithoutRef<'header'>

function Aside({ className, ...props }: AsideProps) {
  return (
    <aside
      className={cn('dark:bg-night-2 bg-slate-800 text-snow-1', className)}
      {...props}
    >
      <SideNavBar />
    </aside>
  )
}

export { Aside }
