import React from 'react'
import { Search } from 'lucide-react'

import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/helpers'

type SearchInputProps = React.ComponentPropsWithoutRef<'form'>

export function TopNavSearch({ className }: SearchInputProps) {

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    let search = formData.get('search') as string
    search = search.trim()
    if (!search) return

    event.currentTarget.reset()
    console.log(`跳转至页面: ${search}`)
  }

  return (
    <form onSubmit={handleSearch} className={cn(className)}>
      <div className="relative flex items-center justify-center">
        <div className="flex-grow max-w-md">
          <Input
            name="search"
            type="search"
            placeholder="搜索..."
            className="peer pl-10 border-0 rounded-tr-none rounded-br-none focus:ring-0"
          />

          <span
            className="peer-focus:text-slate-600 absolute inset-y-0 flex items-center pl-2 text-slate-400 dark:peer-focus:text-slate-300"
          >
            <Search/>
          </span>
        </div>

        <Button
          type="submit"
          className="w-16 bg-slate-700 rounded-tl-none rounded-bl-none hover:bg-slate-600 hover:shadow-none focus:bg-slate-600 focus:ring-0 focus:shadow-none"
        >
          搜索
        </Button>
      </div>
    </form>
  )
}
