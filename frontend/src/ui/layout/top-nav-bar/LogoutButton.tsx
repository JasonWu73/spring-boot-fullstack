import {LogOut} from 'lucide-react'

import {Button} from '@/ui/shadcn-ui/Button'
import {useAuth} from '@/features/auth/AuthContext'

function LogoutButton() {
  const {logout} = useAuth()

  function handleLogout() {
    logout()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="link"
      className="grid w-full grid-cols-[auto_1fr] gap-2 text-left"
    >
      <LogOut className="h-4 w-4"/>
      注销
    </Button>
  )
}

export {LogoutButton}
