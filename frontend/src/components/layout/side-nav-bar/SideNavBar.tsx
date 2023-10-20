import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FolderCog, UserCog2 } from 'lucide-react'

import { Separator } from '@/components/ui/Separator'
import { cn } from '@/lib/utils'

function SideNavBar() {
  return (
    <nav className="flex w-48 flex-col items-center justify-center gap-2">
      <h2 className="font-semibold text-slate-400">后端交互</h2>
      <Menu>
        <MenuItem link="/users">
          <UserCog2 className="h-5 w-5" />
          用户列表
        </MenuItem>
      </Menu>

      <MenuSeparator />
      <h2 className="font-semibold text-slate-400">前端存储</h2>
      <ul>
        <li>
          <Link
            to="/menus"
            className="flex items-center justify-center gap-1 text-sm"
          >
            <FolderCog className="h-4 w-4" />
            菜单权限
          </Link>
        </li>
      </ul>
    </nav>
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
  return <Separator className="dark:bg-night-3 my-2 w-4/5" />
}

export { SideNavBar }
