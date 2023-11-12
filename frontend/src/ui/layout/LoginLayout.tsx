import React from 'react'
import { Outlet } from 'react-router-dom'

import { SpinnerFullPage } from '@/ui/SpinnerFullPage'
import { Footer } from '@/ui/layout/Footer'
import { Header } from '@/ui/layout/Header'

export default function LoginLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header className="dark:bg-night-1" />

      <main className="bg-night relative flex-grow bg-[url('/img/bg_login.png')] bg-[length:100%] bg-no-repeat text-snow">
        <React.Suspense fallback={<SpinnerFullPage />}>
          <Outlet />
        </React.Suspense>
      </main>

      <Footer className="bg-night dark:bg-night border-t border-t-slate-600 text-snow" />
    </div>
  )
}
