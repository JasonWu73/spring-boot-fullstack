import { Outlet } from 'react-router-dom'

import { Header } from '@/ui/layout/Header'
import CartOverview from '@/features/cart/CartOverview'

function AppLayout() {
  return (
    <div>
      <Header />

      <main>
        <h1>内容</h1>
        <Outlet />
      </main>

      <CartOverview />
    </div>
  )
}

export { AppLayout }
