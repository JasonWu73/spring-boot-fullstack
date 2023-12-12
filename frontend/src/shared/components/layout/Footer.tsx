import React from 'react'

import { getVersion } from '@/shared/signals/version'
import { cn } from '@/shared/utils/helpers'

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

export function Footer({ className, ...props }: FooterProps) {
  let version = getVersion()

  return (
    <footer
      className={cn('bg-slate-100 dark:bg-night-3 dark:text-snow', className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-4">
        <Message>
          © {new Date().getFullYear()}{' '}
          {version && (
            <span>
              {version.developer} {version.name} {version.version} 构建于：
              {version.builtAt}
            </span>
          )}
        </Message>
      </div>
    </footer>
  )
}

type MessageProps = {
  children: React.ReactNode
}

function Message({ children }: MessageProps) {
  return <p className="text-center text-sm">{children}</p>
}
