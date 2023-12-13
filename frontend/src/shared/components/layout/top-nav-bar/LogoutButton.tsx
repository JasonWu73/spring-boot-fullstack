import { LogOut } from 'lucide-react'

import LoadingButton from '@/shared/components/ui/LoadingButton'
import { useApi } from '@/shared/hooks/use-api'
import { clearAuth, requestApi } from '@/shared/signals/auth'

export function LogoutButton() {
  const {
    state: { loading },
    requestData
  } = useApi(requestApi<void>)

  async function handleLogout() {
    await requestData({
      url: '/api/v1/auth/logout',
      method: 'DELETE'
    })

    clearAuth()
  }

  return (
    <LoadingButton
      variant="link"
      loading={loading}
      onClick={handleLogout}
      className="grid w-full grid-cols-[auto_1fr] gap-2 text-left"
    >
      {!loading && <LogOut className="h-4 w-4" />}
      退出
    </LoadingButton>
  )
}
