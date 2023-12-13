import { Link } from 'react-router-dom'

import { buttonVariants } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/helpers'
import { LogIn } from 'lucide-react'

export function LoginButton() {
  return (
    <Link
      to="/login"
      className={cn(
        buttonVariants(),
        'bg-sky-600 text-slate-50 hover:bg-sky-600/90 focus-visible:ring-slate-300'
      )}
    >
      <LogIn className="mr-2 h-4 w-4" />
      登录
    </Link>
  )
}
