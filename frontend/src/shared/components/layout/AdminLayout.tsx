import React from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/shared/components/layout/Header'
import { Aside } from '@/shared/components/layout/Aside'
import { Footer } from '@/shared/components/layout/Footer'
import { isCollapsed } from '@/shared/components/layout/side-menu-signals'
import { LoadingFullPage } from '@/shared/components/ui/LoadingFullPage'
import { cn, isMac } from '@/shared/utils/helpers'
import { useKeypress } from '@/shared/hooks/use-keypress'

export function AdminLayout() {
  const collapsed = isCollapsed()
  const [zenMode, setZenMode] = React.useState(false)

  // 禅模式（Zen Mode）快捷键：
  // 1. macOS：`cmd + shift + s`
  // 2. windows 或 Linux：`ctrl + shift + s`
  if (isMac()) {
    useKeypress({ key: 's', modifiers: ['metaKey', 'shiftKey'] }, toggleZenMode)
  } else {
    useKeypress({ key: 's', modifiers: ['ctrlKey', 'shiftKey'] }, toggleZenMode)
  }

  function toggleZenMode() {
    setZenMode(prev => !prev)
  }

  if (zenMode) {
    return (
      <main className="relative h-screen p-4">
        <React.Suspense fallback={<LoadingFullPage/>}>
          <Outlet/>
        </React.Suspense>
      </main>
    )
  }

  return (
    <div className="relative grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto] h-screen">
      <Header className="col-span-2 row-span-1"/>

      <Aside
        className={cn(
          'absolute top-[3.3125rem] z-40 lg:static lg:col-span-1 lg:row-span-3',
          collapsed && 'hidden'
        )}
      />

      <main
        className={cn(
          'col-span-2 row-span-1 lg:col-span-1',
          collapsed && 'lg:col-span-2'
        )}
      >
        <div className="relative p-4">
          <React.Suspense fallback={<LoadingFullPage/>}>
            <Outlet/>
          </React.Suspense>
        </div>
      </main>

      <Footer className={cn(
        'col-span-2 row-span-1 lg:col-span-1',
        collapsed && 'lg:col-span-2'
      )}/>
    </div>
  )
}
