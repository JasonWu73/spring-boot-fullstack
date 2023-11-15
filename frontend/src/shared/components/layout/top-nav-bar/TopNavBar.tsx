import React from 'react'

import { Hamburger } from '@/shared/components/Hamburger'
import { PanelFold } from '@/shared/components/layout/panel-fold/PanelFold'
import { AuthButton } from '@/shared/components/layout/top-nav-bar/AuthButton'
import { Logo } from '@/shared/components/layout/top-nav-bar/Logo'
import { PageNav } from '@/shared/components/layout/top-nav-bar/PageNav'
import { ModeToggle } from '@/shared/components/ui/ModeToggle'

type TopNavBarProps = {
  showPanelFold?: boolean
}

function TopNavBar({ showPanelFold = false }: TopNavBarProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = React.useState(false)

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // 当点击页面链接后，应该自动关闭汉堡包导航菜单
    e.target instanceof HTMLAnchorElement && setIsHamburgerOpen(false)
  }

  return (
    <nav
      onClick={handleClick}
      className="flex h-16 items-center justify-between gap-4 p-4"
    >
      <div className="flex items-center gap-4">
        {showPanelFold && <PanelFold />}
        <Logo />
      </div>

      <PageNav isOpen={isHamburgerOpen} />

      <div className="flex gap-4">
        <AuthButton />
        <ModeToggle />
        <Hamburger isOpen={isHamburgerOpen} onToggle={setIsHamburgerOpen} />
      </div>
    </nav>
  )
}

export { TopNavBar }