import { Link } from 'react-router-dom'

import { buttonVariants } from '@/shared/components/ui/Button'
import { LogIn } from 'lucide-react'

export function LoginButton() {
  return (
    <Link to="/login" className={buttonVariants()}>
      <LogIn className="mr-2 h-4 w-4" />
      登录
    </Link>
  )
}
