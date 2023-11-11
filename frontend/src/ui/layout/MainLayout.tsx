import React from 'react'
import { Outlet } from 'react-router-dom'

import { SpinnerFullPage } from '@/ui/SpinnerFullPage'
import { Footer } from '@/ui/layout/Footer'
import { Header } from '@/ui/layout/Header'

export default function MainLayout() {
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
