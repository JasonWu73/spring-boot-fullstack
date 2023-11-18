import { ReloadIcon } from '@radix-ui/react-icons'
import { LogOut } from 'lucide-react'
import React from 'react'

import { useAuth } from '@/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'
import { useToast } from '@/shared/components/ui/use-toast'

function LogoutButton() {
  const { logoutError: error, logoutLoading: loading, logout } = useAuth()
  const { toast } = useToast()

  React.useEffect(() => {
    if (!error) return

    toast({
      title: '退出失败',
      description: error,
      variant: 'destructive'
    })
  }, [error, toast])

  return (
    <Button
      onClick={() => logout()}
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
