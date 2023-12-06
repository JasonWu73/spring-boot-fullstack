import React from 'react'

import { version } from '@/shared/store/version-state'
import { cn } from '@/shared/utils/helpers'

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

export function Footer({ className, ...props }: FooterProps) {
  const { developer, name, version: ver, builtAt } = version.value ?? {}

  return (
    <footer
      className={cn('bg-slate-100 dark:bg-night-3 dark:text-snow', className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-4">
        <Message>
          © {new Date().getFullYear()} {developer} {name} {ver} 构建于：{builtAt}
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
