import { Link } from 'react-router-dom'

import { buttonVariants } from '@/shared/components/ui/Button'
import { cn, tw } from '@/shared/utils/helpers'

export default function NotFoundPage() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <h1>页面不存在 😞</h1>
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: 'link' }),
          tw`text-base text-sky-500 dark:text-sky-600`
        )}
      >
        返回首页
      </Link>
    </div>
  )
}
