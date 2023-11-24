import React from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '@/shared/components/layout/Footer'
import { Header } from '@/shared/components/layout/Header'
import { SpinnerFullPage } from '@/shared/components/ui/SpinnerFullPage'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="relative flex-grow">
        <React.Suspense fallback={<SpinnerFullPage />}>
          <Outlet />
        </React.Suspense>
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
