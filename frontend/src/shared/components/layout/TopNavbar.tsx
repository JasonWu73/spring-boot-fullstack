import { Logo } from '@/shared/components/layout/Logo'
import { TopNavSearch } from '@/shared/components/layout/TopNavSearch'
import { AuthSwitch } from '@/shared/components/layout/AuthSwitch'
import { SideMenuHamburger } from '@/shared/components/layout/SideMenuHamburger'
import { ModeToggle } from '@/shared/components/ui/ModeToggle'

export function TopNavbar() {
  return (
    <nav className="flex items-center justify-between gap-4 p-2">
      <div className="flex items-center gap-2">
        <SideMenuHamburger
          className="bg-transparent hover:bg-slate-600 hover:shadow-none focus:bg-slate-600 focus:ring-0 focus:shadow-none"
        />

        <Logo/>
      </div>

      <TopNavSearch className="hidden flex-grow sm:flex"/>

      <div className="flex items-center gap-2">
        <AuthSwitch/>

        <ModeToggle
          className="bg-transparent hover:bg-slate-600 hover:shadow-none focus:bg-slate-600 focus:ring-0 focus:shadow-none"
        />
      </div>
    </nav>
  )
}
