import { LayoutDashboard } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/auth/AuthProvider'
import { LoginButton } from '@/shared/components/layout/top-nav-bar/LoginButton'
import { LogoutButton } from '@/shared/components/layout/top-nav-bar/LogoutButton'
import { buttonVariants } from '@/shared/components/ui/Button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/shared/components/ui/NavigationMenu'
import { cn } from '@/shared/utils/helpers'

function AuthSwitch() {
  const { auth, isAdmin } = useAuth()

  if (!auth) return <LoginButton />

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onPointerMove={(event) => event.preventDefault()}
            onPointerLeave={(event) => event.preventDefault()}
            className="text-night hover:bg-snow hover:text-night focus:bg-snow focus:text-night data-[active]:bg-snow data-[state=open]:bg-snow dark:text-snow dark:hover:bg-night-1 dark:hover:text-snow dark:focus:bg-night-1 dark:focus:text-snow dark:data-[active]:bg-night-1 dark:data-[state=open]:bg-night-1"
          >
            {auth.nickname}
          </NavigationMenuTrigger>

          <NavigationMenuContent
            onPointerEnter={(event) => event.preventDefault()}
            onPointerLeave={(event) => event.preventDefault()}
          >
            <ul className="grid min-w-max grid-flow-row grid-cols-1 py-1">
              {isAdmin && (
                <NavItem link="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                  管理后台
                </NavItem>
              )}

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

export { AuthSwitch }
