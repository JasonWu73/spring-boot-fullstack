import React from 'react'

import { TopNavBar } from '@/shared/components/layout/top-nav-bar/TopNavBar'
import { cn } from '@/shared/utils/helpers'

type HeaderProps = React.ComponentPropsWithoutRef<'header'> & {
  showPanelFold?: boolean
}

function Header({ showPanelFold = false, className, ...props }: HeaderProps) {
  return (
    <header className={cn('bg-slate-800 text-snow dark:bg-night', className)} {...props}>
      <TopNavBar showPanelFold={showPanelFold} />
    </header>
  )
}

export { Header }