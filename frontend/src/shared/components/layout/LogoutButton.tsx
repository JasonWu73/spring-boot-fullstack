import { LogOut } from 'lucide-react'

import { Button } from '@/shared/components/ui/Button'
import { useFetch } from '@/shared/hooks/use-fetch'
import { logoutApi } from '@/shared/apis/backend/auth'
import { clearAuth } from '@/shared/auth/auth-signals'

export function LogoutButton() {
  const { loading, fetchData: logout } = useFetch(logoutApi)

  async function handleLogout() {
    await logout(null)
    clearAuth()
  }

  return (
    <Button
      variant="ghost"
      loading={loading}
      onClick={handleLogout}
      className="grid grid-cols-[auto_1fr] gap-2 w-full text-left"
    >
      {!loading && <LogOut className="h-4 w-4"/>}
      退出
    </Button>
  )
}
