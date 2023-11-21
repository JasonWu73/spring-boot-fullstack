import { ReloadIcon } from '@radix-ui/react-icons'
import { LogOut } from 'lucide-react'

import { LOADING_TYPE_LOGOUT, useAuth } from '@/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'

function LogoutButton() {
  const { loading, logout } = useAuth()

  const isLoading = loading?.type === LOADING_TYPE_LOGOUT && loading.isLoading

  return (
    <Button
      onClick={logout}
      variant="link"
      className="grid w-full grid-cols-[auto_1fr] gap-2 text-left"
      disabled={isLoading}
    >
      {!isLoading && <LogOut className="h-4 w-4" />}
      {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      退出
    </Button>
  )
}

export { LogoutButton }
