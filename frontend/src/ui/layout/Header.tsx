import React from 'react'

import { TopNavBar } from '@/ui/layout/top-nav-bar/TopNavBar'
import { cn } from '@/utils/helpers'

type HeaderProps = React.ComponentPropsWithoutRef<'header'> & {
  showPanelFold?: boolean
}

function Header({ showPanelFold = false, className, ...props }: HeaderProps) {
  return (
    <header
      className={cn('dark:bg-night bg-slate-800 text-snow', className)}
      {...props}
    >
      <TopNavBar showPanelFold={showPanelFold} />
    </header>
  )
}

export { Header }
