import React from 'react'
import { NavLink } from 'react-router-dom'

import { AuthSwitch } from '@/shared/components/layout/top-nav-bar/AuthSwitch'
import { buttonVariants } from '@/shared/components/ui/Button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/shared/components/ui/NavigationMenu'
import { hasUser } from '@/shared/signals/auth'
import { cn } from '@/shared/utils/helpers'

type PageNavProps = {
  open: boolean
}

export function TopNavItem({ open }: PageNavProps) {
  return (
    <>
      <NavigationMenu className="hidden max-w-full justify-start lg:flex">
        <NavigationMenuList className="gap-4">
          <NavItemList />
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu
        className={cn(
          'absolute left-0 top-16 z-50 h-[calc(100%-4rem)] w-full max-w-full -translate-x-full items-start bg-slate-950 pt-4 duration-500 dark:bg-night-1 lg:hidden',
          open && 'translate-x-0'
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
      <div className="sm:hidden">
        <AuthSwitch />
      </div>

      <NavItem link="/split-bill">分账 App</NavItem>

      {hasUser() && <NavItem link="/fetch">useFetch</NavItem>}
    </>
  )
}

type NavItemProps = {
  children: React.ReactNode
  link: string
}

function NavItem({ children, link }: NavItemProps) {
  return (
    <NavigationMenuItem className="hover:text-sky-500 hover:dark:text-sky-600">
      <NavLink
        to={link}
        className={({ isActive }) =>
          cn(
            buttonVariants({ variant: 'link' }),
            'text-base font-bold text-snow hover:text-sky-500 hover:no-underline focus-visible:ring-slate-300 dark:text-snow dark:hover:text-sky-600',
            isActive && 'text-sky-500 dark:text-sky-600'
          )
        }
      >
        {children}
      </NavLink>
    </NavigationMenuItem>
  )
}
