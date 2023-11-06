import React from 'react'

import { TopNavBar } from '@/ui/layout/top-nav-bar/TopNavBar'
import { cn } from '@/utils/helpers'

type HeaderProps = React.ComponentPropsWithoutRef<'header'> & {
  showPanelFoldIcon?: boolean
}

function Header({
  showPanelFoldIcon = false,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn('bg-slate-800 text-snow-1 dark:bg-night-1', className)}
      {...props}
    >
      <TopNavBar showPanelFoldIcon={showPanelFoldIcon} />
    </header>
  )
}

export { Header }