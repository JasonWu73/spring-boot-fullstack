import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'

import { useApi } from '@/shared/hooks/use-api'
import { useInitial } from '@/shared/hooks/use-refresh'
import { requestApi } from '@/shared/signals/auth'
import { cn } from '@/shared/utils/helpers'

type Version = {
  name: string
  version: string
  developer: string
  builtAt: string
}

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

export function Footer({ className, ...props }: FooterProps) {
  useInitial(() => {
    getVersion().then()
  })

  const {
    state: { loading, data, error },
    requestData
  } = useApi(requestApi<Version>)

  const { developer, name, version, builtAt } = data ?? {}

  async function getVersion() {
    return await requestData({ url: '/api/v1/public/version' })
  }

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
