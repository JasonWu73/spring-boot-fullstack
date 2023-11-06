import { Outlet } from 'react-router-dom'

import { Header } from '@/ui/layout/Header'
import { Footer } from '@/ui/layout/Footer'

export default function LoginLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header className="dark:bg-night-2" />

      <main className="flex-grow bg-night-1 bg-[url('/img/bg_login.png')] bg-[length:100%] bg-no-repeat">
        <Outlet />
      </main>

      <Footer className="border-t border-t-slate-600 bg-night-1 text-snow-1 dark:bg-night-1" />
    </div>
  )
}
