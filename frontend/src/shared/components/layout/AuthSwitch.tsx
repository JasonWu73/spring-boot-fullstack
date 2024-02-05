import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, CircleUserRound, LogOut } from 'lucide-react'

import { Button, buttonVariant } from '@/shared/components/ui/Button'
import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { Tooltip } from '@/shared/components/ui/Tooltip'
import { cn, truncate } from '@/shared/utils/helpers'
import { clearAuth, getAuth } from '@/shared/auth/auth-signals'
import { useFetch } from '@/shared/hooks/use-fetch'
import { logoutApi } from '@/shared/apis/backend/auth'

const ROUTES = [
  { link: '/profile', icon: <CircleUserRound className="h-4 w-4"/>, text: '个人资料' },
  { link: null, icon: <LogOut className="h-4 w-4"/>, text: '退出登录' }
] as const

export function AuthSwitch() {
  const [open, setOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const navigate = useNavigate()

  const { fetchData: logout } = useFetch(logoutApi)

  const auth = getAuth()
  if (!auth) return null

  // 通过键盘的上下箭头控制结果的选择，回车键确认
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open) return

    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Enter') return

    // 禁用非回车键的默认行为
    if (event.key !== 'Enter') event.preventDefault()

    if (event.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    }

    if (event.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(prev + 1, ROUTES.length - 1))
    }

    if (event.key === 'Enter' && selectedIndex !== -1) {
      // 通过回车键确认选择
      handleNavigate(ROUTES[selectedIndex].link)
    }
  }

  function handleNavigate(link: string | null) {
    if (link) {
      navigate(link)
    } else {
      handleLogout()
    }

    // 重置选择
    setSelectedIndex(-1)
  }

  function delayClose() {
    // 延迟关闭下拉菜单，以便处理点击事件，延迟不能过短，否则有概率会导致点击事件无法触发
    setTimeout(() => setOpen(false), 200)
  }

  function handleLogout() {
    logout(null).then()
    clearAuth()
    navigate('/login')
  }

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant="ghost"
          onClick={() => setOpen(prev => !prev)}
          onBlur={delayClose}
          onKeyDown={handleKeyDown}
          className="text-slate-600 bg-white hover:text-slate-900 focus:text-slate-900 dark:bg-slate-900"
        >
          <Tooltip title={auth.nickname} className="flex items-center">
            <span className="mr-1">{truncate(auth.nickname, 7)}</span>

            {open ? <ArrowUp className="h-4 w-4"/> : <ArrowDown className="h-4 w-4"/>}
          </Tooltip>
        </Button>
      }
      content={
        // 这里不要使用 `<a>`、`<button>` 等会获取焦点的标签，因它会导致 `Tab` 导航丢失一次
        <ul className="w-28">
          {ROUTES.map((nav, index) => (
            <NavItem
              key={index}
              selected={selectedIndex === index}
              onClick={() => handleNavigate(nav.link)}
              className={cn(
                index === 0 && 'rounded-br-none rounded-bl-none',
                index === ROUTES.length - 1 && 'rounded-tr-none rounded-tl-none',
                index !== 0 && index !== ROUTES.length - 1 && 'rounded-none'
              )}
            >
              {nav.icon}
              {nav.text}
            </NavItem>
          ))}
        </ul>
      }
    />
  )
}

type NavItemProps = React.ComponentPropsWithoutRef<'li'> & {
  selected: boolean
}

function NavItem({ children, selected, className, ...props }: NavItemProps) {
  return (
    <li
      {...props}
      className={cn(
        buttonVariant('ghost'),
        'grid grid-cols-[auto_1fr] gap-2 w-full text-left',
        selected && 'bg-slate-100 dark:bg-slate-800',
        className
      )}
    >
      {children}
    </li>
  )
}
