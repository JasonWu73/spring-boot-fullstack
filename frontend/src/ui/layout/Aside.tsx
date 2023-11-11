import React from 'react'

import {cn} from '@/utils/helpers'
import {SideNavBar} from '@/ui/layout/side-nav-bar/SideNavBar'

type AsideProps = React.ComponentPropsWithoutRef<'header'>

function Aside({className, ...props}: AsideProps) {
  return (
    <aside
      className={cn('p-4 bg-slate-700 dark:bg-night-2 text-snow', className)}
      {...props}
    >
      <SideNavBar/>
    </aside>
  )
}

export {Aside}
