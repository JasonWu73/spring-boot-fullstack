import React from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { Input } from '@/shared/components/ui/Input'
import { Code } from '@/shared/components/ui/Code'
import { cn } from '@/shared/utils/helpers'

type SearchInputProps = React.ComponentPropsWithoutRef<'form'>

export function TopNavSearch({ className }: SearchInputProps) {
  const [search, setSearch] = React.useState('')
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        className="flex-grow max-w-xl"
        trigger={
          <div>
            <Input
              name="search"
              type="search"
              placeholder="搜索..."
              onFocus={() => setOpen(true)}
              value={search}
              onChange={event => setSearch(event.target.value)}
              autoComplete="off"
              className="peer pl-10 border-0 focus:ring-0"
            />

            <span
              className="peer-focus:text-slate-600 absolute inset-y-0 flex items-center pl-2 text-slate-400 dark:peer-focus:text-slate-300"
            >
              <Search/>
            </span>
          </div>
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
                  {[
                    { link: '/search/1', title: '搜索结果 1' },
                    { link: '/search/2', title: '搜索结果 2' },
                    { link: '/search/3', title: '搜索结果 3' }
                  ].map(item => (
                    <li key={item.link}>
                      <SearchResultItem {...item} onClick={() => setSearch('')}/>
                    </li>
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

type SearchResultItemProps = {
  link: string
  title: string
  onClick: () => void
}

function SearchResultItem({ link, title, onClick }: SearchResultItemProps) {
  return (
    <Link
      to={link}
      onClick={onClick}
      className="block p-4 text-slate-900 rounded hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {title}
    </Link>
  )
}
