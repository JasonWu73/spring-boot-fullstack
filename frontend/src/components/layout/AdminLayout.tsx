import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Aside } from '@/components/layout/Aside'
import { useTheme } from '@/components/ui/ThemeProvider'
import { cn } from '@/lib/utils'

function AdminLayout() {
  const { folded } = useTheme()

  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <Header showPanelFoldIcon={true} className="col-span-2 row-span-1" />

      <Aside
        className={cn(
          'col-span-1 row-span-1 transform transition duration-500',
          {
            hidden: folded
          }
        )}
      />

      <main
        className={cn('col-span-1 row-span-1 flex flex-col', {
          'col-span-2': folded
        })}
      >
        <div className="flex-grow p-4">
          <Outlet />
        </div>

        <Footer />
      </main>
    </div>
  )
}

export { AdminLayout }