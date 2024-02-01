import React from 'react'

import { Logo } from '@/shared/components/layout/top-nav-bar/Logo'
import { SearchInput } from '@/shared/components/layout/SearchInput'
import { AuthSwitch } from '@/shared/components/layout/top-nav-bar/AuthSwitch'
import { Hamburger } from '@/shared/components/ui/Hamburger'
import { ModeToggle } from '@/shared/components/ui/ModeToggle'
import { setTheme } from '@/shared/components/ui/theme-signals'

export function TopNavbar() {
  const [openHamburger, setOpenHamburger] = React.useState(false)

  function handleClickNavItem(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // 当点击页面链接后，应该自动关闭汉堡包导航菜单
    if (e.target instanceof HTMLAnchorElement) {
      setOpenHamburger(false)
    }
  }

  return (
    <nav
      onClick={handleClickNavItem}
      className="flex items-center justify-between gap-4 p-2"
    >
      <Logo/>

      <SearchInput className="hidden flex-grow sm:block"/>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <AuthSwitch/>
        </div>

        <ModeToggle
          setTheme={setTheme}
          className="border-slate-900 focus-visible:ring-slate-300"
        />

        <Hamburger open={openHamburger} onOpenChange={setOpenHamburger}/>
      </div>
    </nav>
  )
}
