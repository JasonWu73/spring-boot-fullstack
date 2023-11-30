import { BugOff, FileClock, ShoppingCart, UserCog2 } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/shared/auth/AuthProvider'
import { ScrollArea } from '@/shared/components/ui/ScrollArea'
import { Separator } from '@/shared/components/ui/Separator'
import { cn } from '@/shared/utils/helpers'

function SideNavBar() {
  const { isRoot } = useAuth()

  return (
    <ScrollArea className="h-[calc(100vh-6rem)] w-48">
      <nav className="flex flex-col items-center gap-2">
        <Menu title="系统管理">
          <MenuItem link="/users">
            <UserCog2 className="h-5 w-5" />
            <span>用户管理</span>
          </MenuItem>
          <MenuItem link="/operation-logs">
            <FileClock className="h-5 w-5" />
            <span>操作日志</span>
          </MenuItem>
        </Menu>

        <MenuSeparator />

        <Menu title="测试路由">
          {isRoot && (
            <MenuItem link="/product">
              <ShoppingCart className="h-4 w-4" />
              <span>随机商品</span>
            </MenuItem>
          )}

          <MenuItem link="/no-route">
            <BugOff className="h-4 w-4" />
            <span>Not Found</span>
          </MenuItem>
        </Menu>
      </nav>
    </ScrollArea>
  )
}

type MenuProps = {
  children: React.ReactNode
  title: string
}

function Menu({ children, title }: MenuProps) {
  return (
    <>
      <h2 className="w-10/12 pl-4 text-slate-400">{title}</h2>
      <ul className="flex w-10/12 flex-col gap-0.5">{children}</ul>
    </>
  )
}

type MenuItemProps = {
  children: React.ReactNode
  link: string
}

function MenuItem({ children, link }: MenuItemProps) {
  return (
    <li className="hover:rounded hover:bg-sky-500 hover:dark:bg-sky-600">
      <NavLink
        to={link}
        className={({ isActive }) =>
          cn(
            'grid grid-cols-[16px_1fr] grid-rows-1 items-center gap-2 rounded px-4 py-2 text-sm',
            isActive &&
              'rounded border border-sky-500 bg-sky-500 font-bold dark:border-sky-600 dark:bg-sky-600'
          )
        }
      >
        {children}
      </NavLink>
    </li>
  )
}

function MenuSeparator() {
  return <Separator className="my-2 w-4/5 dark:bg-night-4" />
}

export { SideNavBar }
