import reactLogo from '@/assets/react.svg'
import { ModeToggle } from '@/components/ui/ModeToggle'
import { Link, NavLink } from 'react-router-dom'
import React from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/NavigationMenu'

function NavBar() {
  return (
    <nav className="flex h-16 items-center justify-between gap-4 bg-slate-950 p-4 text-snow-1 dark:bg-slate-700">
      <PageNav />
      <ModeToggle />
    </nav>
  )
}

function PageNav() {
  return (
    <div className="flex flex-1 items-center gap-4">
      <Logo />

      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          <NavItem link="/fetch">
            Custom Hook: <code>useFetch</code>
          </NavItem>

          <NavItem link="/eat-and-split">Comprehensive form</NavItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
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
      <div className="flex items-center gap-2">
        <img src={reactLogo} alt="React Logo" />
        <h2 className="text-2xl font-bold">TS + React + Tailwind CSS</h2>
      </div>
    </Link>
  )
}

export { NavBar }
