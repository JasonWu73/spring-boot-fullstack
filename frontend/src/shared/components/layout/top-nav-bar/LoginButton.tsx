import { Link } from 'react-router-dom'

import { LOADING_TYPE_LOGIN, useAuth } from '@/auth/AuthProvider'
import { Button } from '@/shared/components/ui/Button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { LogIn } from 'lucide-react'

function LoginButton() {
  const { loading } = useAuth()

  const isLoading = loading?.type === LOADING_TYPE_LOGIN && loading.isLoading

  return (
    <Link
      to="/login"
      onClick={(e) => {
        if (loading) {
          e.preventDefault()
        }
      }}
    >
      <Button disabled={isLoading}>
        {!isLoading && <LogIn className="mr-2 h-4 w-4" />}
        {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        登录
      </Button>
    </Link>
  )
}

export { LoginButton }
