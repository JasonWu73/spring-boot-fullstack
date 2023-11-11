import React from 'react'

import { SideNavBar } from '@/ui/layout/side-nav-bar/SideNavBar'
import { cn } from '@/utils/helpers'

type AsideProps = React.ComponentPropsWithoutRef<'header'>

function Aside({ className, ...props }: AsideProps) {
  return (
    <aside
      className={cn('bg-slate-700 p-4 text-snow dark:bg-night-2', className)}
      {...props}
    >
      <SideNavBar />
    </aside>
  )
}

export { Aside }
