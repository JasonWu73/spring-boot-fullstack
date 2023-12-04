import React from 'react'

import { SideNavBar } from '@/shared/components/layout/side-nav-bar/SideNavBar'
import { cn } from '@/shared/utils/helpers'

type AsideProps = React.ComponentPropsWithoutRef<'header'>

export function Aside({ className, ...props }: AsideProps) {
  return (
    <aside
      className={cn('dark bg-night-1 p-4 text-snow dark:bg-night-1', className)}
      {...props}
    >
      <SideNavBar />
    </aside>
  )
}
