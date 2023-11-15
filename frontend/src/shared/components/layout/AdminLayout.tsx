import React from 'react'
import { Outlet } from 'react-router-dom'

import { SpinnerFullPage } from '@/shared/components/SpinnerFullPage'
import { Aside } from '@/shared/components/layout/Aside'
import { Footer } from '@/shared/components/layout/Footer'
import { Header } from '@/shared/components/layout/Header'
import { usePanelFold } from '@/shared/components/layout/panel-fold/PanelFoldProvider'
import { cn } from '@/shared/utils/helpers'

export default function AdminLayout() {
  const { folded } = usePanelFold()

  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <Header showPanelFold={true} className="col-span-2 row-span-1" />

      <Aside className={cn('col-span-1 row-span-1', folded && 'hidden')} />

      <main className={cn('col-span-1 row-span-1 flex flex-col', folded && 'col-span-2')}>
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
