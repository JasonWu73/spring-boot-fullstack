import { Link, useNavigate } from 'react-router-dom'
import { LogIn, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useRefreshLogin } from '@/components/auth/RequireAuth'
import { STORAGE_KEY } from '@/api/dummyjson/auth'

function LoginButton() {
  const { loggedIn } = useRefreshLogin()
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY)
    navigate('/login')
  }

  return (
    <>
      {!loggedIn && (
        <Link to="/login">
          <Button>
            <LogIn className="mr-2 h-4 w-4" />
            登录
          </Button>
        </Link>
      )}

      {loggedIn && (
        <Button onClick={handleLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          注销
        </Button>
      )}
    </>
  )
}

export { LoginButton }
