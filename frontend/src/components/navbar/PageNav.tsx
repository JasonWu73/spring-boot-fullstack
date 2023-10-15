import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/NavigationMenu'
import { cn } from '@/lib/utils'
import React from 'react'
import { NavLink } from 'react-router-dom'

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

export { PageNav }
