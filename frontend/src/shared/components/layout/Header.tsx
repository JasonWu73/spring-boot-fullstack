import React from 'react'

import { TopNavBar } from '@/shared/components/layout/top-nav-bar/TopNavBar'
import { cn } from '@/shared/utils/helpers'

type HeaderProps = React.ComponentPropsWithoutRef<'header'> & {
  showPanelFold?: boolean
}

export function Header({ showPanelFold = false, className, ...props }: HeaderProps) {
  return (
    <header className={cn('dark bg-night text-snow dark:bg-night', className)} {...props}>
      <TopNavBar showPanelFold={showPanelFold} />
    </header>
  )
}
