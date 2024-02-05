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
      setSelectedIndex(prev => Math.min(prev + 1, 1))
    }

    if (event.key === 'Enter' && selectedIndex !== -1) {
      // 通过回车键确认选择
      if (selectedIndex === 0) {
        navigate('/profile')
      }

      if (selectedIndex === 1) {
        handleLogout()
      }

      // 重置选择，以免下次回车打开菜单时自动触发选择
      setSelectedIndex(-1)
    }
  }

  function delayClose() {
    // 延迟关闭下拉菜单，以便处理点击事件，延迟不能过短，否则有概率会导致点击事件无法触发
    setTimeout(() => setOpen(false), 200)
  }

  function handleLogout() {
    logout(null).then()
    clearAuth()
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
        <ul>
          <li
            onClick={() => navigate('/profile')}
            onMouseEnter={() => setSelectedIndex(0)}
            className={cn(
              buttonVariant('ghost'),
              'grid grid-cols-[auto_1fr] gap-2 w-full text-left rounded-br-none rounded-bl-none',
              selectedIndex === 0 && 'bg-slate-100 dark:bg-slate-800'
            )}
          >
            <CircleUserRound className="h-4 w-4"/>
            个人资料
          </li>

          <li
            onClick={handleLogout}
            onMouseEnter={() => setSelectedIndex(1)}
            className={cn(
              buttonVariant('ghost'),
              'grid grid-cols-[auto_1fr] gap-2 w-full text-left rounded-tr-none rounded-tl-none',
              selectedIndex === 1 && 'bg-slate-100 dark:bg-slate-800'
            )}
          >
            <LogOut className="h-4 w-4"/>
            退出登录
          </li>
        </ul>
      }
    />
  )
}
