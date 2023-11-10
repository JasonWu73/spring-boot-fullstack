import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'

import {Header} from '@/ui/layout/Header'
import {Footer} from '@/ui/layout/Footer'
import {SpinnerFullPage} from '@/ui/SpinnerFullPage'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>

      <main className="relative flex-grow">
        <Suspense fallback={<SpinnerFullPage/>}>
          <Outlet/>
        </Suspense>
      </main>

      <Footer/>
    </div>
  )
}
