import React from 'react'
import { NavLink } from 'react-router-dom'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/ui/shadcn-ui/NavigationMenu'
import { cn } from '@/utils/helpers'

type PageNavProps = {
  isOpen: boolean
}

function PageNav({ isOpen }: PageNavProps) {
  return (
    <>
      <NavigationMenu className="hidden max-w-full justify-start lg:flex">
        <NavigationMenuList className="gap-4">
          <NavItemList />
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu
        className={cn(
          'absolute left-0 top-16 z-50 h-[calc(100%-4rem)] w-full max-w-full -translate-x-full items-start bg-slate-950 pt-4 duration-500 dark:bg-night-2 lg:hidden',
          isOpen && 'translate-x-0'
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
      <NavItem link="/split-bill">全面的表单</NavItem>
      <NavItem link="/fetch">自定义 useFetch</NavItem>
    </>
  )
}

type NavItemProps = {
  children: React.ReactNode
  link: string
}

function NavItem({ children, link }: NavItemProps) {
  return (
    <NavigationMenuItem className="font-bold hover:text-sky-500 hover:dark:text-sky-600">
      <NavLink
        to={link}
        className={({ isActive }) =>
          isActive ? 'text-sky-500 dark:text-sky-600' : ''
        }
      >
        {children}
      </NavLink>
    </NavigationMenuItem>
  )
}

export { PageNav }
