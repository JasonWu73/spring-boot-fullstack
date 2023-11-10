import React from 'react'
import {NavLink} from 'react-router-dom'
import {Binary, Calculator, Component, FunctionSquare, UserCog2} from 'lucide-react'

import {Separator} from '@/ui/shadcn-ui/Separator'
import {cn} from '@/utils/helpers'
import {ScrollArea} from '@/ui/shadcn-ui/ScrollArea'

function SideNavBar() {
  return (
    <ScrollArea className="h-[calc(100vh-6rem)] w-48">
      <nav className="flex flex-col items-center gap-2">
        <Menu title="后端交互">
          <MenuItem link="/users">
            <UserCog2 className="h-5 w-5"/>
            <span>用户列表</span>
          </MenuItem>
        </Menu>

        <MenuSeparator/>
        <Menu title="React 性能优化">
          <MenuItem link="/children">
            <Binary className="h-4 w-4"/>
            <span>children 属性</span>
          </MenuItem>
          <MenuItem link="/memo">
            <Component className="h-4 w-4"/>
            <span>memo 组件</span>
          </MenuItem>
          <MenuItem link="/use-memo">
            <Calculator className="h-4 w-4"/>
            <span>useMemo</span>
          </MenuItem>
          <MenuItem link="/use-callback">
            <FunctionSquare className="h-4 w-4"/>
            <span>useCallback</span>
          </MenuItem>
        </Menu>
      </nav>
    </ScrollArea>
  )
}

type MenuProps = {
  title: string
  children: React.ReactNode
}

function Menu({title, children}: MenuProps) {
  return (
    <>
      <h2 className="w-10/12 pl-4 font-semibold text-slate-400">{title}</h2>
      <ul className="w-10/12">{children}</ul>
    </>
  )
}

type MenuItemProps = {
  link: string
  children: React.ReactNode
}

function MenuItem({link, children}: MenuItemProps) {
  return (
    <li>
      <NavLink
        to={link}
        className={({isActive}) =>
          cn(
            'grid grid-cols-[16px_1fr] grid-rows-1 items-center gap-2 rounded px-4 py-2 text-sm',
            isActive && 'font-bold bg-sky-500 dark:bg-sky-600'
          )
        }
      >
        {children}
      </NavLink>
    </li>
  )
}

function MenuSeparator() {
  return <Separator className="my-2 w-4/5 dark:bg-night-3"/>
}

export {SideNavBar}
