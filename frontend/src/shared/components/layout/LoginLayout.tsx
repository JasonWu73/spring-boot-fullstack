import React from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '@/shared/components/layout/Footer'
import { Header } from '@/shared/components/layout/Header'
import { SpinnerFullPage } from '@/shared/components/ui/SpinnerFullPage'

export function LoginLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header className="dark:bg-night-1" />

      <main className="relative flex-grow bg-night bg-[url('/img/bg_login.png')] bg-[length:100%] bg-no-repeat p-4 text-snow">
        <React.Suspense fallback={<SpinnerFullPage />}>
          <Outlet />
        </React.Suspense>
      </main>

      <Footer className="border-t border-t-slate-600 bg-night text-snow dark:bg-night" />
    </div>
  )
}
