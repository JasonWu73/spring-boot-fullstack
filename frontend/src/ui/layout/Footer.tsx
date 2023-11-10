import React from 'react'

import {cn} from '@/utils/helpers'

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

function Footer({className, ...props}: FooterProps) {
  return (
    <footer
      className={cn('bg-slate-100 dark:bg-night-4 dark:text-snow', className)}
      {...props}
    >
      <div className="flex flex-col flex-wrap container mx-auto px-5 py-4">
        <p className="text-center text-sm">
          © {new Date().getFullYear()} 吴仙杰 v0.0.1
        </p>
      </div>
    </footer>
  )
}

export {Footer}
