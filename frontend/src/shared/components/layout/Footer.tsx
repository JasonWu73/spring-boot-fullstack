import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'

import { getVersion } from '@/shared/apis/backend/version'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useInitial } from '@/shared/hooks/use-refresh'
import { cn } from '@/shared/utils/helpers'

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

export function Footer({ className, ...props }: FooterProps) {
  const {
    loading,
    data: versionInfo,
    error,
    fetchData: fetchVersion
  } = useFetch(getVersion)

  useInitial(() => {
    fetchVersion(null).then()
  })

  const { developer, name, version, builtAt } = versionInfo ?? {}

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
            <span className="text-red-500 dark:text-red-600">{error}</span>
          )}

          {!loading && !error && versionInfo && (
            <span>
              {developer} {name} {version} 构建于：{builtAt}
            </span>
          )}
        </p>
      </div>
    </footer>
  )
}
