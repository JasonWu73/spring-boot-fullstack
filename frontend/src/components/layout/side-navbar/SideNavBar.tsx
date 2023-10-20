import { Link, NavLink } from 'react-router-dom'
import { FolderCog, UserCog2 } from 'lucide-react'

import { Separator } from '@/components/ui/Separator'
import { cn } from '@/lib/utils'

function SideNavBar() {
  return (
    <nav className="hidden md:flex md:w-48 md:flex-col md:items-center md:justify-center md:gap-2">
      <h2 className="font-semibold text-slate-400">后端交互</h2>
      <ul>
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              cn('flex items-center justify-center gap-1 text-sm', {
                'font-bold text-sky-500': isActive
              })
            }
          >
            <UserCog2 className="h-5 w-5" />
            用户列表
          </NavLink>
        </li>
      </ul>

      <Separator className="my-2 w-4/5" />
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

export { SideNavBar }
