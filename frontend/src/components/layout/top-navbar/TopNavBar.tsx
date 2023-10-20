import React, { useState } from 'react'

import { ModeToggle } from '@/components/ui/ModeToggle'
import { Logo } from '@/components/layout/top-navbar/Logo'
import { PageNav } from '@/components/layout/top-navbar/PageNav'
import { AuthButton } from '@/components/layout/top-navbar/AuthButton'
import { HamburgerMenuIcon } from '@/components/layout/top-navbar/HamburgerMenuIcon'

function TopNavBar() {
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
      <Logo />
      <PageNav isHamburgerOpen={isHamburgerOpen} />
      <div className="flex gap-4">
        <AuthButton />
        <ModeToggle />
        <HamburgerMenuIcon
          isOpen={isHamburgerOpen}
          onToggle={setIsHamburgerOpen}
        />
      </div>
    </nav>
  )
}

export { TopNavBar }
