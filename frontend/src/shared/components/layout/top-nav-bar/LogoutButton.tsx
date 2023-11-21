import { ReloadIcon } from '@radix-ui/react-icons'
import { LogOut } from 'lucide-react'
import React from 'react'

import { useAuth } from '@/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'

function LogoutButton() {
  const [loading, setLoading] = React.useState(false)

  const { logout } = useAuth()

  async function handleLogout() {
    setLoading(true)

    await logout()

    setLoading(false)
  }

  return (
    <Button
      onClick={handleLogout}
      variant="link"
      className="grid w-full grid-cols-[auto_1fr] gap-2 text-left"
      disabled={loading}
    >
      {!loading && <LogOut className="h-4 w-4" />}
      {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      退出
    </Button>
  )
}

export { LogoutButton }
