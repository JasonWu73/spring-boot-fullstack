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
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">
        <main className="col-span-2 row-span-2 relative p-4">
          <React.Suspense fallback={<LoadingFullPage/>}>
            <Outlet/>
          </React.Suspense>
        </main>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">
      <Header className="col-span-2 row-span-1"/>

      <Aside
        className={cn(
          'col-span-1 row-span-1 overflow-auto h-[calc(100vh-3.3125rem)]',
          collapsed && 'hidden'
        )}
      />

      <main
        className={cn(
          'col-span-1 row-span-1 flex flex-col',
          collapsed && 'col-span-2'
        )}
      >
        <div className="flex-grow relative p-4">
          <React.Suspense fallback={<LoadingFullPage/>}>
            <Outlet/>
          </React.Suspense>
        </div>

        <Footer/>
      </main>
    </div>
  )
}
