import React from 'react'
import {NavLink} from 'react-router-dom'
import {BugOff, ShoppingCart, UserCog2} from 'lucide-react'

import {Separator} from '@/ui/shadcn-ui/Separator'
import {cn} from '@/utils/helpers'
import {ScrollArea} from '@/ui/shadcn-ui/ScrollArea'

function SideNavBar() {
  return (
    <ScrollArea className="h-[calc(100vh-6rem)] w-48">
      <nav className="flex flex-col items-center gap-2">
        <Menu title="后端交互">
          <MenuItem link="/users">
            <UserCog2 className="w-5 h-5"/>
            <span>用户列表</span>
          </MenuItem>

          <MenuItem link="/product">
            <ShoppingCart className="w-4 h-4"/>
            <span>随机商品</span>
          </MenuItem>
        </Menu>

        <MenuSeparator/>

        <Menu title="测试路由">
          <MenuItem link="/no-route">
            <BugOff className="w-4 h-4"/>
            <span>Not Found</span>
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
      <h3 className="pl-4 w-10/12 text-slate-400">{title}</h3>
      <ul className="flex flex-col gap-0.5 w-10/12">{children}</ul>
    </>
  )
}

type MenuItemProps = {
  link: string
  children: React.ReactNode
}

function MenuItem({link, children}: MenuItemProps) {
  return (
    <li className="hover:rounded hover:bg-sky-500 hover:dark:bg-sky-600">
      <NavLink
        to={link}
        className={({isActive}) =>
          cn(
            'grid grid-rows-1 grid-cols-[16px_1fr] items-center gap-2 px-4 py-2 rounded text-sm',
            isActive && 'rounded border border-sky-500 dark:border-sky-600 bg-sky-500 dark:bg-sky-600 font-bold'
          )
        }
      >
        {children}
      </NavLink>
    </li>
  )
}

function MenuSeparator() {
  return <Separator className="my-2 w-4/5 dark:bg-night-4"/>
}

export {SideNavBar}
