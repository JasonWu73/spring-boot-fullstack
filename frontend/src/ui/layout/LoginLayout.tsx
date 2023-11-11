import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'

import {Header} from '@/ui/layout/Header'
import {Footer} from '@/ui/layout/Footer'
import {SpinnerFullPage} from '@/ui/SpinnerFullPage'

export default function LoginLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header className="dark:bg-night-2"/>

      <main
        className="flex-grow relative bg-night-1 bg-[url('/img/bg_login.png')] bg-[length:100%] bg-no-repeat text-snow"
      >
        <Suspense fallback={<SpinnerFullPage/>}>
          <Outlet/>
        </Suspense>
      </main>

      <Footer className="border-t border-t-slate-600 bg-night-1 dark:bg-night-1 text-snow"/>
    </div>
  )
}
