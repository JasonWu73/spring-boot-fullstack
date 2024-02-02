import React from 'react'

import { Logo } from '@/shared/components/layout/top-nav-bar/Logo'
import { TopNavSearch } from '@/shared/components/layout/TopNavSearch'
import { AuthSwitch } from '@/shared/components/layout/top-nav-bar/AuthSwitch'
import { SideMenuHamburger } from '@/shared/components/layout/SideMenuHamburger'
import { ModeToggle } from '@/shared/components/ui/ModeToggle'
import { setTheme } from '@/shared/components/ui/theme-signals'

export function TopNavbar() {
  const [openHamburger, setOpenHamburger] = React.useState(true)

  function handleClickNavItem(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // 当点击页面链接后，应该自动关闭汉堡导航菜单
    if (e.target instanceof HTMLAnchorElement) {
      setOpenHamburger(false)
    }
  }

  return (
    <nav
      onClick={handleClickNavItem}
      className="flex items-center justify-between gap-4 p-2"
    >
      <div className="flex items-center">
        <SideMenuHamburger
          open={openHamburger}
          onOpenChange={setOpenHamburger}
          className="bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 focus:ring-0"
        />

        <Logo/>
      </div>

      <TopNavSearch className="hidden flex-grow sm:block"/>

      <div className="flex items-center gap-4">
        <AuthSwitch/>

        <ModeToggle
          setTheme={setTheme}
          className="bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 focus:ring-0"
        />
      </div>
    </nav>
  )
}
