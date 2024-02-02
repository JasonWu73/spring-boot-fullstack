import React from 'react'

import { SideNavbar } from '@/shared/components/layout/SideNavbar'
import { cn } from '@/shared/utils/helpers'

type AsideProps = React.ComponentPropsWithoutRef<'aside'>;

export function Aside({ className, ...props }: AsideProps) {
  return (
    <aside
      {...props}
      className={cn('text-slate-200 bg-one-dark-1 p-4', className)}
    >
      <SideNavbar/>
    </aside>
  )
}
