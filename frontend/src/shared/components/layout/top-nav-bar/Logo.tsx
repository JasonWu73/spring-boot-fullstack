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
        <h2
          className="flex items-center h-8 pl-10 uppercase bg-[url('/img/react.svg')] bg-left bg-no-repeat"
        >
          React
        </h2>
      </span>
    </Link>
  )
}
