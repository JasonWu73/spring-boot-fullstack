import { ReloadIcon } from '@radix-ui/react-icons'
import { LogOut } from 'lucide-react'

import { useAuth } from '@/shared/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'
import { useFetch } from '@/shared/hooks/use-api'

function LogoutButton() {
  const { requestApi, deleteAuth } = useAuth()

  const { loading, fetchData } = useFetch(requestApi<void>)

  async function handleLogout() {
    await fetchData({
      url: '/api/v1/auth/logout',
      method: 'DELETE'
    })

    deleteAuth()
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
