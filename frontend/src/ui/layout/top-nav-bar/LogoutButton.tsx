import {LogOut} from 'lucide-react'

import {Button} from '@/ui/shadcn-ui/Button'
import {useAuth} from '@/features/auth/AuthProvider'

function LogoutButton() {
  const {logout} = useAuth()

  function handleLogout() {
    logout()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="link"
      className="grid grid-cols-[auto_1fr] gap-2 w-full text-left"
    >
      <LogOut className="w-4 h-4"/>
      注销
    </Button>
  )
}

export {LogoutButton}
