import React from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'

import { useAuth } from '@/components/auth/AuthProvider'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/NavigationMenu'
import { LoginButton } from '@/components/layout/top-nav-bar/LoginButton'
import { LogoutButton } from '@/components/layout/top-nav-bar/LogoutButton'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function AuthButton() {
  const { auth } = useAuth()

  if (!auth) {
    return <LoginButton />
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black dark:text-snow-1">
            {auth.nickname}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid min-w-max grid-flow-row grid-cols-1 gap-1 py-2">
              <NavItem link="/admin">
                <LayoutDashboard className="h-4 w-4" />
                管理后台
              </NavItem>

              <li>
                <LogoutButton />
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

type NavItemProps = {
  children: React.ReactNode
  link: string
}

function NavItem({ children, link }: NavItemProps) {
  return (
    <li>
      <Link
        to={link}
        className={cn(
          buttonVariants({ variant: 'link' }),
          'grid w-full grid-cols-[auto_1fr] gap-2'
        )}
      >
        {children}
      </Link>
    </li>
  )
}

export { AuthButton }