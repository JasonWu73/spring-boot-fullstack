import { Logo } from '@/shared/components/layout/top-nav-bar/Logo'
import { TopNavSearch } from '@/shared/components/layout/TopNavSearch'
import { AuthSwitch } from '@/shared/components/layout/top-nav-bar/AuthSwitch'
import { SideMenuHamburger } from '@/shared/components/layout/SideMenuHamburger'
import { ModeToggle } from '@/shared/components/ui/ModeToggle'
import { setTheme } from '@/shared/components/ui/theme-signals'

export function TopNavbar() {
  return (
    <nav className="flex items-center justify-between gap-4 p-2">
      <div className="flex items-center">
        <SideMenuHamburger
          className="bg-transparent hover:bg-slate-600 hover:shadow-none focus:bg-slate-600 focus:ring-0 focus:shadow-none"
        />

        <Logo/>
      </div>

      <TopNavSearch className="hidden flex-grow sm:block"/>

      <div className="flex items-center gap-4">
        <AuthSwitch/>

        <ModeToggle
          setTheme={setTheme}
          className="bg-transparent hover:bg-slate-600 hover:shadow-none focus:bg-slate-600 focus:ring-0 focus:shadow-none"
        />
      </div>
    </nav>
  )
}
