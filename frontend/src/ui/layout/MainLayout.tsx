import {Outlet} from 'react-router-dom'

import {Header} from '@/ui/layout/Header'
import {Footer} from '@/ui/layout/Footer'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>

      <main className="flex-grow">
        <Outlet/>
      </main>

      <Footer/>
    </div>
  )
}
