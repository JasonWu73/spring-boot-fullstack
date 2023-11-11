import React from 'react'
import { Outlet } from 'react-router-dom'

import { SpinnerFullPage } from '@/ui/SpinnerFullPage'
import { Aside } from '@/ui/layout/Aside'
import { Footer } from '@/ui/layout/Footer'
import { Header } from '@/ui/layout/Header'
import { usePanelFold } from '@/ui/layout/panel-fold/PanelFoldProvider'
import { cn } from '@/utils/helpers'

export default function AdminLayout() {
  const { folded } = usePanelFold()

  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <Header showPanelFold={true} className="col-span-2 row-span-1" />

      <Aside className={cn('col-span-1 row-span-1', folded && 'hidden')} />

      <main
        className={cn(
          'col-span-1 row-span-1 flex flex-col',
          folded && 'col-span-2'
        )}
      >
        <div className="relative flex-grow p-4">
          <React.Suspense fallback={<SpinnerFullPage />}>
            <Outlet />
          </React.Suspense>
        </div>

        <Footer />
      </main>
    </div>
  )
}
