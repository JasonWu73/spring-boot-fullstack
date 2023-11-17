import { ReloadIcon } from '@radix-ui/react-icons'
import { LogOut } from 'lucide-react'

import { useAuth } from '@/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'
import { useToast } from '@/shared/components/ui/use-toast'

function LogoutButton() {
  const { logoutLoading: loading, logout, deleteLoginCache } = useAuth()
  const { toast } = useToast()

  async function handleLogout() {
    const response = await logout()
    if (response.success) return deleteLoginCache()

    toast({
      title: '退出失败',
      description: response.error,
      variant: 'destructive'
    })
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
