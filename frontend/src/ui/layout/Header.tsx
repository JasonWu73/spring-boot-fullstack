import React from 'react'

import {TopNavBar} from '@/ui/layout/top-nav-bar/TopNavBar'
import {cn} from '@/utils/helpers'

type HeaderProps = React.ComponentPropsWithoutRef<'header'> & {
  showPanelFold?: boolean
}

function Header({
  showPanelFold = false,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn('bg-slate-800 dark:bg-night-1 text-snow', className)}
      {...props}
    >
      <TopNavBar showPanelFoldIcon={showPanelFold}/>
    </header>
  )
}

export {Header}
