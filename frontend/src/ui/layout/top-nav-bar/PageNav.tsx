import React from 'react'
import {NavLink} from 'react-router-dom'

import {NavigationMenu, NavigationMenuItem, NavigationMenuList} from '@/ui/shadcn-ui/NavigationMenu'
import {cn} from '@/utils/helpers'

type PageNavProps = {
  isOpen: boolean
}

function PageNav({isOpen}: PageNavProps) {
  return (
    <>
      <NavigationMenu className="hidden lg:flex justify-start max-w-full">
        <NavigationMenuList className="gap-4">
          <NavItemList/>
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu
        className={cn(
          'lg:hidden absolute top-16 left-0 z-50 items-start pt-4 w-full max-w-full h-[calc(100%-4rem)] -translate-x-full duration-500 bg-slate-950 dark:bg-night-2',
          isOpen && 'translate-x-0'
        )}
      >
        <NavigationMenuList className="flex-col gap-4">
          <NavItemList/>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

function NavItemList() {
  return (
    <>
      <NavItem link="split-bill">全面的表单</NavItem>
      <NavItem link="/fetch">自定义 useFetch</NavItem>
    </>
  )
}

type NavItemProps = {
  link: string
  children: React.ReactNode
}

function NavItem({link, children}: NavItemProps) {
  return (
    <NavigationMenuItem className="font-bold hover:text-sky-500 hover:dark:text-sky-600">
      <NavLink
        to={link}
        className={({isActive}) => isActive ? 'text-sky-500 dark:text-sky-600' : ''}
      >
        {children}
      </NavLink>
    </NavigationMenuItem>
  )
}

export {PageNav}
