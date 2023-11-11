import { LogOut } from 'lucide-react'

import { useAuth } from '@/features/auth/AuthProvider'
import { Button } from '@/ui/shadcn-ui/Button'

function LogoutButton() {
  const { logout } = useAuth()

  return (
    <Button
      onClick={() => logout()}
      variant="link"
      className="grid w-full grid-cols-[auto_1fr] gap-2 text-left"
    >
      <LogOut className="h-4 w-4" />
      注销
    </Button>
  )
}

export { LogoutButton }
