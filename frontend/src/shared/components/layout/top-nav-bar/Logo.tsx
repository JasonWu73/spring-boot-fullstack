import { Link } from 'react-router-dom'

import reactLogo from '@/shared/assets/react.svg'
import { buttonVariants } from '@/shared/components/ui/Button'
import { cn, tw } from '@/shared/utils/helpers'

export function Logo() {
  return (
    <Link
      to="/"
      className={cn(
        buttonVariants({ variant: 'link' }),
        tw`text-snow hover:no-underline dark:text-snow`
      )}
    >
      <span className="flex items-center gap-2">
        <img src={reactLogo} alt="React Logo" />
        <h2 className="uppercase">React</h2>
      </span>
    </Link>
  )
}
