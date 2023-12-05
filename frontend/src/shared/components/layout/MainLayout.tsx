import React from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '@/shared/components/layout/Footer'
import { Header } from '@/shared/components/layout/Header'
import { LoadingFullPage } from '@/shared/components/ui/LoadingFullPage'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="relative flex-grow p-4">
        <React.Suspense fallback={<LoadingFullPage />}>
          <Outlet />
        </React.Suspense>
      </main>

      <Footer />
    </div>
  )
}
