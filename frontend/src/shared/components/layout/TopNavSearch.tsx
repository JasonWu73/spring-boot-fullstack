import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { Input } from '@/shared/components/ui/Input'
import { Code } from '@/shared/components/ui/Code'
import { cn } from '@/shared/utils/helpers'

type Route = {
  link: string
  text: string
}

// 待搜索的路由
const ROUTES: Route[] = [
  { link: '/', text: '工作台' },
  { link: '/profile', text: '个人资料' },
  { link: '/users', text: '用户管理' },
  { link: '/op-logs', text: '操作日志' },
  { link: '/demo', text: 'UI 组件' },
  { link: '/no-route', text: 'Not Found' }
]

type SearchInputProps = {
  className?: string
}

export function TopNavSearch({ className }: SearchInputProps) {
  const [search, setSearch] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [matchedResults, setMatchedResults] = React.useState<Route[]>([])
  const navigate = useNavigate()

  // 通过键盘的上下箭头控制搜索结果的选择，回车键跳转
  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return

    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Enter') return

    // 禁用非回车键的默认行为
    if (event.key !== 'Enter') event.preventDefault()

    if (event.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    }

    if (event.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(prev + 1, matchedResults.length - 1))
    }

    if (event.key === 'Enter' && selectedIndex !== -1) {
      // 跳转到选中的搜索结果
      handleNavigate(matchedResults[selectedIndex].link)
    }
  }

  function handleNavigate(link: string) {
    navigate(link)

    // 清空搜索框
    setSearch('')

    // 重置搜索结果的选择
    setSelectedIndex(-1)

    // 失去搜索框焦点
    inputRef.current?.blur()
  }

  function delayClose() {
    // 延迟关闭下拉菜单，以便处理点击事件，延迟不能过短，否则有概率会导致点击事件无法触发
    setTimeout(() => setOpen(false), 200)
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setSearch(value)

    // 过滤匹配的路由
    const text = value.toLowerCase().trim()
    const results = ROUTES.filter(route => route.text.toLowerCase().includes(text))
    setMatchedResults(results)
  }

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        className="flex-grow max-w-xl"
        trigger={
          <>
            <Input
              ref={inputRef}
              name="search"
              type="search"
              placeholder="搜索..."
              autoComplete="off"
              onFocus={() => setOpen(true)}
              onBlur={delayClose}
              value={search}
              onChange={handleSearch}
              onKeyDown={handleSearchKeyDown}
              className="peer pl-10 border-0 focus:ring-0"
            />

            <span
              className="peer-focus:text-slate-600 absolute inset-y-0 flex items-center pl-2 text-slate-400 dark:peer-focus:text-slate-300"
            >
              <Search/>
            </span>
          </>
        }
        content={
          <div>
            {!search && (
              <>
                <h2
                  className="p-4 text-slate-500 text-base border-b border-b-slate-200 dark:text-slate-400 dark:border-b-slate-700"
                >
                  禅模式（Zen Mode）快捷键
                </h2>

                <ol className="p-4 space-y-2 text-slate-600 text-sm dark:text-slate-300">
                  <li>macOS：<Code>cmd + shift + s</Code></li>
                  <li>windows 或 Linux：<Code>ctrl + shift + s</Code></li>
                </ol>
              </>
            )}

            {search && matchedResults.length > 0 && (
              <>
                <h2 className="p-4 text-slate-500 dark:text-slate-400">
                  搜索结果
                </h2>
                <ul>
                  {matchedResults.map((item, index) => (
                    <ResultItem
                      {...item}
                      key={item.link}
                      selected={index === selectedIndex}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => handleNavigate(item.link)}
                      className={cn(
                        'rounded-none',
                        index === matchedResults.length - 1 && 'rounded-tr-none rounded-tl-none'
                      )}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>
        }
      />
    </div>
  )
}

type SearchResultItemProps = React.ComponentPropsWithoutRef<'li'> & {
  text: string
  selected: boolean
  className?: string
}

function ResultItem({ text, selected, className, ...props }: SearchResultItemProps) {
  // 这里不要使用 `<a>`、`<button>` 等会获取焦点的标签，因它会导致 `Tab` 导航丢失一次
  return (
    <li
      {...props}
      className={cn(
        'block p-4 text-slate-900 rounded cursor-pointer hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
        selected && 'bg-slate-100 dark:bg-slate-800',
        className
      )}
    >
      {text}
    </li>
  )
}
