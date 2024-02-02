import React from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '@/shared/components/layout/Footer'
import { LoadingFullPage } from '@/shared/components/ui/LoadingFullPage'

export function LoginLayout() {
  return (
    <div className="flex flex-col h-screen">
      <main className="relative flex-grow p-4 text-snow bg-one-dark bg-[url('/img/bg_login.png')] bg-[length:100%] bg-no-repeat">
        <React.Suspense fallback={<LoadingFullPage/>}>
          <Outlet/>
        </React.Suspense>
      </main>

      <Footer className="text-slate-200 bg-one-dark"/>
    </div>
  )
}
