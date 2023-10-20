import React, { useState } from 'react'

import { ModeToggle } from '@/components/ui/ModeToggle'
import { Logo } from '@/components/layout/top-nav-bar/Logo'
import { PageNav } from '@/components/layout/top-nav-bar/PageNav'
import { AuthButton } from '@/components/layout/top-nav-bar/AuthButton'
import { MenuUnfoldIcon } from '@/components/ui/MenuUnfoldIcon'
import { PanelFoldIcon } from '@/components/ui/PanelFoldIcon'

type TopNavBarProps = {
  showPanelFoldIcon?: boolean
}

function TopNavBar({ showPanelFoldIcon = false }: TopNavBarProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // 当点击页面链接后, 自动关闭中小屏幕下才显示的汉堡包导航菜单
    if (e.target instanceof HTMLAnchorElement) {
      setIsHamburgerOpen(false)
    }
  }

  return (
    <nav
      onClick={handleClick}
      className="flex h-16 items-center justify-between gap-4 p-4"
    >
      <div className="flex items-center gap-4">
        {showPanelFoldIcon && <PanelFoldIcon />}

        <Logo />
      </div>

      <PageNav isOpen={isHamburgerOpen} />

      <div className="flex gap-4">
        <AuthButton />
        <ModeToggle />
        <MenuUnfoldIcon
          isOpen={isHamburgerOpen}
          onToggle={setIsHamburgerOpen}
        />
      </div>
    </nav>
  )
}

export { TopNavBar }
