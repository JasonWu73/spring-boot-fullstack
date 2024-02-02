import React from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/shared/components/layout/Header'
import { Aside } from '@/shared/components/layout/Aside'
import { Footer } from '@/shared/components/layout/Footer'
import { LoadingFullPage } from '@/shared/components/ui/LoadingFullPage'
import { isCollapsed } from '@/shared/components/layout/side-menu-signals'
import { cn } from '@/shared/utils/helpers'

export function AdminLayout() {
  const folded = isCollapsed()

  return (
    <div className="grid h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <Header className="col-span-2 row-span-1"/>

      <Aside className={cn('col-span-1 row-span-1', folded && 'hidden')}/>

      <main
        className={cn(
          'col-span-1 row-span-1 flex flex-col',
          folded && 'col-span-2'
        )}
      >
        <div className="relative flex-grow p-4">
          <React.Suspense fallback={<LoadingFullPage/>}>
            <Outlet/>
          </React.Suspense>
        </div>

        <Footer/>
      </main>
    </div>
  )
}
