import React from 'react'
import { NavLink } from 'react-router-dom'
import { FolderCog, UserCog2 } from 'lucide-react'

import { Separator } from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/ScrollArea'

function SideNavBar() {
  return (
    <ScrollArea className="h-[calc(100vh-6rem)] w-48">
      <nav className="flex flex-col items-center justify-center gap-2">
        <h2 className="font-semibold text-slate-400">后端交互</h2>
        <Menu>
          <MenuItem link="/users">
            <UserCog2 className="h-5 w-5" />
            用户列表
          </MenuItem>
        </Menu>

        <MenuSeparator />
        <h2 className="font-semibold text-slate-400">前端存储</h2>
        <Menu>
          <MenuItem link="/menus">
            <FolderCog className="h-4 w-4" />
            菜单权限
          </MenuItem>
        </Menu>
      </nav>
    </ScrollArea>
  )
}

type MenuProps = {
  children: React.ReactNode
}

function Menu({ children }: MenuProps) {
  return <ul className="w-3/4">{children}</ul>
}

type MenuItemProps = {
  link: string
  children: React.ReactNode
}

function MenuItem({ link, children }: MenuItemProps) {
  return (
    <li>
      <NavLink
        to={link}
        className={({ isActive }) =>
          cn(
            'flex items-center justify-center gap-1 rounded px-4 py-2 text-sm',
            {
              'bg-sky-500 font-bold dark:bg-sky-600': isActive
            }
          )
        }
      >
        {children}
      </NavLink>
    </li>
  )
}

function MenuSeparator() {
  return <Separator className="my-2 w-4/5 dark:bg-night-3" />
}

export { SideNavBar }
