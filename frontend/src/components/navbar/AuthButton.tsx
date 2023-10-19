import { useAuth } from '@/components/auth/AuthProvider'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/NavigationMenu'
import { LogoutButton } from '@/components/navbar/LogoutButton'
import { LoginButton } from '@/components/navbar/LoginButton'

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
            <ul className="grid w-40 grid-flow-row grid-cols-1 gap-1 px-4 py-2">
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

export { AuthButton }
