import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export { MainLayout }
