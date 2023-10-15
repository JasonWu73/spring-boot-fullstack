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
  const line = tw`ease my-1 h-[2px] w-[1.2rem] transform rounded-full bg-white transition duration-300 group-hover:bg-slate-800 group-hover:dark:bg-white`

  return (
    <div className="flex items-center lg:hidden">
      <Button
        onClick={() => onToggle(!isOpen)}
        variant="outline"
        size="icon"
        className="group flex-col"
      >
        <div
          className={cn(line, {
            'translate-y-[0.625rem] rotate-45': isOpen
          })}
        />
        <div
          className={cn(line, {
            'opacity-0': isOpen,
            'my-0': !isOpen
          })}
        />
        <div
          className={cn(line, {
            '-translate-y-[0.625rem] -rotate-45': isOpen
          })}
        />
      </Button>
    </div>
  )
}

export { NavBar }
