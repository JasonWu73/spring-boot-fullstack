import React from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/shared/components/layout/Header'
import { Aside } from '@/shared/components/layout/Aside'
import { Footer } from '@/shared/components/layout/Footer'
import { isCollapsed } from '@/shared/components/layout/side-menu-signals'
import { LoadingFullPage } from '@/shared/components/ui/LoadingFullPage'
import { cn } from '@/shared/utils/helpers'

export function AdminLayout() {
  const collapsed = isCollapsed()

  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">
      <Header className="col-span-2 row-span-1"/>

      <Aside className={cn('col-span-1 row-span-1', collapsed && 'hidden')}/>

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
