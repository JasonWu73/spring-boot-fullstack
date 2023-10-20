import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Aside } from '@/components/layout/Aside'

function AdminLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <Header className="col-span-2 row-span-1" />

      <Aside className="col-span-1 row-span-1" />

      <main className="col-span-1 row-span-1">
        <Outlet />

        <Footer />
      </main>
    </div>
  )
}

export { AdminLayout }
