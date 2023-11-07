import { Outlet, useNavigation } from 'react-router-dom'

import { Header } from '@/ui/layout/Header'
import CartOverview from '@/features/cart/CartOverview'
import { Spinner } from '@/ui/Spinner'

function AppLayout() {
  const navigation = useNavigation()
  const loading = navigation.state === 'loading'

  return (
    <div className="layout">
      {loading && <Spinner />}

      <Header />

      <main>
        <Outlet />
      </main>

      <CartOverview />
    </div>
  )
}

export { AppLayout }
