import React from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '@/shared/components/layout/Footer'
import { LoadingFullPage } from '@/shared/components/ui/LoadingFullPage'

export function LoginLayout() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-500 to-green-500 dark:bg-one-dark dark:bg-[url('/img/bg_login.png')] dark:bg-[length:100%] dark:bg-no-repeat">
      <main
        className="flex-grow relative p-4"
      >
        <React.Suspense fallback={<LoadingFullPage/>}>
          <Outlet/>
        </React.Suspense>
      </main>

      <Footer className="bg-transparent dark:bg-transparent"/>
    </div>
  )
}
