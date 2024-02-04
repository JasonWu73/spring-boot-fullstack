import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { Input } from '@/shared/components/ui/Input'
import { Code } from '@/shared/components/ui/Code'
import { cn } from '@/shared/utils/helpers'

type SearchInputProps = {
  className?: string
}

export function TopNavSearch({ className }: SearchInputProps) {
  const [search, setSearch] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const navigate = useNavigate()
  const results = [
    { link: '/', title: '工作台' },
    { link: '/users', title: '用户管理' },
    { link: '/op-logs', title: '操作日志' },
    { link: '/404', title: '未知页面' }
  ]

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
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    }

    if (event.key === 'Enter' && selectedIndex !== -1) {
      // 跳转到选中的搜索结果
      const link = results[selectedIndex].link
      navigate(link)

      // 清空搜索框
      setSearch('')

      // 重置搜索结果的选择
      setSelectedIndex(-1)

      // 失去搜索框焦点
      inputRef.current?.blur()
    }
  }

  function delayClose() {
    // 延迟关闭下拉菜单，以便处理点击事件
    setTimeout(() => setOpen(false), 100)
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
              onChange={event => setSearch(event.target.value)}
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

                <ol className="p-4 list-decimal space-y-2 text-slate-600 text-sm dark:text-slate-400">
                  <li>macOS：<Code>cmd + shift + s</Code></li>
                  <li>windows 或 Linux：<Code>ctrl + shift + s</Code></li>
                </ol>
              </>
            )}

            {search && (
              <>
                <h2 className="p-4 text-slate-500 dark:text-slate-400">
                  搜索结果
                </h2>

                <ul>
                  {results.map((item, index) => (
                    <SearchResultItem
                      key={item.link}
                      {...item}
                      selected={index === selectedIndex}
                      onMouseEnter={() => setSelectedIndex(index)}
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
  link: string
  title: string
  selected: boolean
}

function SearchResultItem({ link, title, selected, ...props }: SearchResultItemProps) {
  const navigate = useNavigate()

  // 这里不要使用 `<a>`、`<button>` 等会获取焦点的标签，因它会导致 `Tab` 导航丢失一次
  return (
    <li
      {...props}
      onClick={() => {
        navigate(link)
      }}
      className={cn(
        'block p-4 text-slate-900 rounded cursor-pointer hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
        selected && 'bg-slate-100 dark:bg-slate-800'
      )}
    >
      {title}
    </li>
  )
}
