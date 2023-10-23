import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

function LoginLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow bg-night-1 bg-[url('/img/bg_login.png')] bg-cover bg-fixed bg-center bg-no-repeat">
        <Outlet />
      </main>

      <Footer className="border-t border-t-slate-600 bg-night-1 text-snow-1 dark:bg-night-1" />
    </div>
  )
}

export { LoginLayout }