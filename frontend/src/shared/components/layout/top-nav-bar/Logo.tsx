import { Link } from 'react-router-dom'

import { cn } from '@/shared/utils/helpers'
import { buttonVariantClasses } from '@/shared/components/ui/Button'

export function Logo() {
  return (
    <Link
      to="/"
      className={cn(
        buttonVariantClasses('link'),
        'px-2 text-slate-200 no-underline hover:text-slate-200 focus:text-slate-200 focus:ring-2'
      )}
    >
      <h2
        className="flex items-center h-8 pl-10 uppercase bg-[url('/img/react.svg')] bg-left bg-no-repeat"
      >
        React
      </h2>
    </Link>
  )
}
