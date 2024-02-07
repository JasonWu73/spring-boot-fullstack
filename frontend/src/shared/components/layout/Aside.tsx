import React from 'react'

import { SideNavbar } from '@/shared/components/layout/SideNavbar'
import { cn } from '@/shared/utils/helpers'

type AsideProps = React.ComponentPropsWithoutRef<'aside'>

export function Aside({ className, ...props }: AsideProps) {
  return (
    <aside
      {...props}
      style={{
        // 因为左侧导航栏的背景色是黑色，所以这里设置滚动条的颜色为黑色
        colorScheme: 'dark'
      }}
      className={cn('text-slate-200 bg-one-dark-1', className)}
    >
      <SideNavbar/>
    </aside>
  )
}
