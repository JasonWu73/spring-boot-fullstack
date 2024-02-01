import { Link } from 'react-router-dom'

import { buttonVariants } from '@/shared/components/ui/ShadButton'
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
        <img draggable={false} src="/img/react.svg" alt="React Logo" className="select-none"/>
        <h2 className="uppercase">React</h2>
      </span>
    </Link>
  )
}
