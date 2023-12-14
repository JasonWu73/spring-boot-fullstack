import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'

import { getVersion } from '@/shared/apis/backend/version'
import { cn } from '@/shared/utils/helpers'
import { useQuery } from '@tanstack/react-query'

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

export function Footer({ className, ...props }: FooterProps) {
  const {
    isLoading: loading,
    data,
    error
  } = useQuery({
    queryKey: ['version'],
    queryFn: getVersion,
    staleTime: Infinity // 版本信息不会变，所以设置为永不过期
  })

  const { developer, name, version, builtAt } = data ?? {}

  return (
    <footer
      className={cn('bg-slate-100 dark:bg-night-3 dark:text-snow', className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-4">
        <p className="flex items-center justify-center gap-1 text-sm">
          <span>© {new Date().getFullYear()}</span>
          {loading && <ReloadIcon className="mr-2 inline-block h-4 w-4 animate-spin" />}

          {!loading && error && (
            <span className="text-red-500 dark:text-red-600">{error.message}</span>
          )}

          {!loading && !error && data && (
            <span>
              {developer} {name} {version} 构建于：{builtAt}
            </span>
          )}
        </p>
      </div>
    </footer>
  )
}
