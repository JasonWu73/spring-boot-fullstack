import { LayoutDashboard } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/features/auth/AuthProvider'
import { LoginButton } from '@/ui/layout/top-nav-bar/LoginButton'
import { LogoutButton } from '@/ui/layout/top-nav-bar/LogoutButton'
import { buttonVariants } from '@/ui/shadcn-ui/Button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/ui/shadcn-ui/NavigationMenu'
import { cn } from '@/utils/helpers'

function AuthButton() {
  const { auth } = useAuth()
  if (!auth) return <LoginButton />

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-night hover:text-night focus:text-night hover:bg-snow focus:bg-snow data-[active]:bg-snow data-[state=open]:bg-snow dark:text-snow dark:hover:bg-night-1 dark:hover:text-snow dark:focus:bg-night-1 dark:focus:text-snow dark:data-[active]:bg-night-1 dark:data-[state=open]:bg-night-1">
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
