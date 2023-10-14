import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import reactLogo from '@/assets/react.svg'
import { ModeToggle } from '@/components/ui/ModeToggle'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/NavigationMenu'
import { cn, tw } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

function NavBar() {
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
      className="flex h-16 items-center justify-between gap-4 bg-slate-950 p-4 text-snow-1 dark:bg-slate-700"
    >
      <Logo />
      <PageNav isHamburgerOpen={isHamburgerOpen} />
      <div className="flex gap-4">
        <LoginButton />
        <ModeToggle />
        <HamburgerIcon isOpen={isHamburgerOpen} onToggle={setIsHamburgerOpen} />
      </div>
    </nav>
  )
}

function LoginButton() {
  return (
    <Link to="/login">
      <Button>登录</Button>
    </Link>
  )
}

type PageNavProps = {
  isHamburgerOpen: boolean
}

function PageNav({ isHamburgerOpen }: PageNavProps) {
  return (
    <>
      <NavigationMenu className="hidden max-w-full justify-start lg:flex">
        <NavigationMenuList className="gap-4">
          <NavItemList />
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu
        className={cn(
          'absolute left-0 top-16 z-50 h-[calc(100%-4rem)] w-full max-w-full -translate-x-full transform items-start bg-slate-950 transition duration-500 dark:bg-slate-700 lg:hidden',
          {
            'translate-x-0': isHamburgerOpen
          }
        )}
      >
        <NavigationMenuList className="flex-col gap-4">
          <NavItemList />
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

function NavItemList() {
  return (
    <>
      <NavItem link="/eat-split">全面的表单</NavItem>
      <NavItem link="/fetch">自定义 useFetch</NavItem>
    </>
  )
}

type NavItemProps = {
  link: string
  children: React.ReactNode
}

function NavItem({ link, children }: NavItemProps) {
  return (
    <NavigationMenuItem className="font-bold hover:text-sky-500">
      <NavLink
        to={link}
        className={({ isActive }) => (isActive ? 'text-sky-500' : '')}
      >
        {children}
      </NavLink>
    </NavigationMenuItem>
  )
}

function Logo() {
  return (
    <Link to="/">
      <span className="flex items-center gap-2">
        <img src={reactLogo} alt="React Logo" />
        <h2 className="text-xl font-bold">TS + React + Tailwind</h2>
      </span>
    </Link>
  )
}

type HamburgerIconProps = {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

function HamburgerIcon({ isOpen, onToggle }: HamburgerIconProps) {
  const genericHamburgerLine = tw`ease my-1 h-1 w-9 transform rounded-full bg-white transition duration-300 dark:bg-slate-950`

  return (
    <div className="flex items-center lg:hidden">
      <button
        className="group flex h-9 w-9 flex-col items-center justify-center"
        onClick={() => onToggle(!isOpen)}
      >
        <div
          className={cn(genericHamburgerLine, {
            'translate-y-3 rotate-45 opacity-50 group-hover:opacity-100':
              isOpen,
            'opacity-50 group-hover:opacity-100': !isOpen
          })}
        />
        <div
          className={cn(genericHamburgerLine, {
            'opacity-0': isOpen,
            'opacity-50 group-hover:opacity-100': !isOpen
          })}
        />
        <div
          className={cn(genericHamburgerLine, {
            '-translate-y-3 -rotate-45 opacity-50 group-hover:opacity-100':
              isOpen,
            'opacity-50 group-hover:opacity-100': !isOpen
          })}
        />
      </button>
    </div>
  )
}

export { NavBar }
