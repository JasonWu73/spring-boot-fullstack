import React from 'react'
import { ArrowDown, ArrowUp, CircleUserRound } from 'lucide-react'

import { LogoutButton } from '@/shared/components/layout/LogoutButton'
import { Button, buttonVariant } from '@/shared/components/ui/Button'
import { Tooltip } from '@/shared/components/ui/Tooltip'
import { getAuth } from '@/shared/auth/auth-signals'
import { Link } from 'react-router-dom'
import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { truncate } from '@/shared/utils/helpers'

export function AuthSwitch() {
  const [open, setOpen] = React.useState(false)

  const auth = getAuth()
  if (!auth) return null

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="text-slate-600 bg-white hover:text-slate-900 focus:text-slate-900 dark:bg-slate-900"
        >
          <Tooltip title={auth.nickname} className="flex items-center">
            <span className="mr-1">{truncate(auth.nickname, 7)}</span>

            {open ? <ArrowUp className="h-4 w-4"/> : <ArrowDown className="h-4 w-4"/>}
          </Tooltip>
        </Button>
      }
      content={
        <ul className="space-y-0.5 w-28">
          <Item link="/profile">
            <CircleUserRound className="h-4 w-4"/>
            个人资料
          </Item>

          <li>
            <LogoutButton/>
          </li>
        </ul>
      }
    />
  )
}

type ItemProps = {
  link: string
  children: React.ReactNode
}

function Item({ link, children }: ItemProps) {
  return (
    <li>
      <Link to={link} className={buttonVariant('ghost')}>
        {children}
      </Link>
    </li>
  )
}
