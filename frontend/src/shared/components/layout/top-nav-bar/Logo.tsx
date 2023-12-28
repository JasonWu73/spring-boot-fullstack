import { Link } from 'react-router-dom'

import reactLogo from '@/shared/assets/images/react.svg'
import { buttonVariants } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/helpers'

export function Logo() {
  return (
    <Link
      to="/"
      className={cn(
        buttonVariants({ variant: 'link' }),
        'text-snow hover:no-underline focus-visible:ring-slate-300 dark:text-snow'
      )}
    >
      <span className="flex items-center gap-2">
        <img src={reactLogo} alt="React Logo" />
        <h2 className="uppercase">React</h2>
      </span>
    </Link>
  )
}
