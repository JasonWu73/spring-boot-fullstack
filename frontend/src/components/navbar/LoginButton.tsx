import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'

function LoginButton() {
  return (
    <Link to="/login">
      <Button>登录</Button>
    </Link>
  )
}

export { LoginButton }
