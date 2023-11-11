import { Link } from 'react-router-dom'

import { Button } from '@/ui/shadcn-ui/Button'
import { LogIn } from 'lucide-react'

function LoginButton() {
  return (
    <Link to="/login">
      <Button>
        <LogIn className="mr-2 h-4 w-4" />
        登录
      </Button>
    </Link>
  )
}

export { LoginButton }
