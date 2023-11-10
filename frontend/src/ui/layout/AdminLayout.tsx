import {Outlet} from 'react-router-dom'

import {usePanelFold} from '@/ui/layout/panel-fold/PanelFoldProvider'
import {Header} from '@/ui/layout/Header'
import {Footer} from '@/ui/layout/Footer'
import {Aside} from '@/ui/layout/Aside'
import {cn} from '@/utils/helpers'

export default function AdminLayout() {
  const {folded} = usePanelFold()

  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] min-h-screen">
      <Header showPanelFoldIcon={true} className="row-span-1 col-span-2"/>

      <Aside
        className={cn(
          'row-span-1 col-span-1 transform transition duration-500',
          folded && 'hidden'
        )}
      />

      <main
        className={cn(
          'row-span-1 col-span-1 flex flex-col',
          folded && 'col-span-2'
        )}
      >
        <div className="flex-grow p-4">
          <Outlet/>
        </div>

        <Footer/>
      </main>
    </div>
  )
}
