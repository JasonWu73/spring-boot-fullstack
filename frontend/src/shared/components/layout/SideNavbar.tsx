import React from 'react'
import { NavLink } from 'react-router-dom'
import { Blocks, BugOff, FileClock, Gauge, UserCog2 } from 'lucide-react'

import { buttonVariant } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/helpers'
import { hasRoot } from '@/shared/auth/auth-signals'

export function SideNavbar() {
  return (
    <nav className="flex flex-col items-center gap-1 p-2">
      <NavItem link="/">
        <Gauge className="h-5 w-5"/>
        <span>工作台</span>
      </NavItem>

      <Separator/>
      <Title text="系统管理"/>
      <NavItem link="/users">
        <UserCog2 className="h-5 w-5"/>
        <span>用户管理</span>
      </NavItem>
      <NavItem link="/op-logs">
        <FileClock className="h-5 w-5"/>
        <span>操作日志</span>
      </NavItem>

      {hasRoot() && (
        <>
          <Separator/>
          <Title text="测试路由"/>
          <NavItem link="/demo">
            <Blocks className="h-4 w-4"/>
            <span>UI 组件</span>
          </NavItem>
          <NavItem link="/no-route">
            <BugOff className="h-4 w-4"/>
            <span>Not Found</span>
          </NavItem>
        </>
      )}
    </nav>
  )
}

type NavItemProps = {
  children: React.ReactNode
  link: string
}

function NavItem({ children, link }: NavItemProps) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) => cn(
        buttonVariant('primary'),
        'grid grid-cols-[auto_1fr] gap-2 w-full bg-transparent text-left',
        isActive && 'bg-sky-500'
      )}
    >
      {children}
    </NavLink>
  )
}

function Separator() {
  return <div className="w-4/5 h-px my-2 bg-slate-600"/>
}

type TitleProps = {
  text: string
}

function Title({ text }: TitleProps) {
  return <h2 className="text-slate-400 text-base">{text}</h2>
}
