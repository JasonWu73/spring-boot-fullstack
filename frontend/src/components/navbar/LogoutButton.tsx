import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/components/auth/AuthProvider'

function LogoutButton() {
  const { logout } = useAuth()

  function handleLogout() {
    logout()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="link"
      className="flex w-full items-center justify-center"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>注销</span>
    </Button>
  )
}

export { LogoutButton }
