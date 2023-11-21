import { Link, useParams } from 'react-router-dom'

import type { Friend } from '@/shared/apis/fake/friend-api'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar'
import { buttonVariants } from '@/shared/components/ui/Button'
import { Code } from '@/shared/components/ui/Code'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/components/ui/Tooltip'
import { cn, truncate } from '@/shared/utils/helpers'
import { useFriends } from '@/split-bill/FriendProvider'

type FriendItemProps = {
  friend: Friend
  onDeleteFriend: (friend: Friend) => void
}

function FriendItem({ friend, onDeleteFriend }: FriendItemProps) {
  const params = useParams()
  const selectedFriendId = Number(params.friendId)
  const selected = friend.id === selectedFriendId

  const { setShowAddFriend } = useFriends()

  function handleToggleSelect() {
    setShowAddFriend(false)
  }

  const name = truncate(friend.name, 5)
  const queryStr = window.location.search

  return (
    <li
      className={cn(
        'group relative flex items-center justify-between gap-2 rounded px-4 py-2 hover:bg-amber-100 dark:hover:text-slate-700',
        selected && 'bg-amber-100 dark:text-night'
      )}
    >
      <ConfirmDialog
        action={
          <div className="absolute left-2 top-1 hidden cursor-pointer text-xs group-hover:block">
            ❌
          </div>
        }
        title={
          <>
            您确定要删除好友<Code className="mx-1">{friend.name}</Code>吗？
          </>
        }
        onConfirm={() => onDeleteFriend(friend)}
      />

      <Avatar>
        <AvatarImage src={friend.image} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-lg font-bold">
                {name}
                {` 🎂 `}
                {friend.birthday}
              </span>
            </TooltipTrigger>

            <TooltipContent>{friend.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {friend.balance > 0 && (
          <p className="text-green-500">
            {name} 欠您 ${friend.balance}
          </p>
        )}

        {friend.balance < 0 && (
          <p className="text-red-500 dark:text-red-600">
            您欠 {name} ${Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance === 0 && <p>你和 {name} 互不相欠</p>}
      </div>

      <Link
        to={selected ? `/split-bill${queryStr}` : `/split-bill/${friend.id}${queryStr}`}
        state={{
          noRefresh: true
        }}
        onClick={handleToggleSelect}
        className={buttonVariants({ variant: 'default' })}
      >
        {selected ? '关闭' : '选择'}
      </Link>
    </li>
  )
}

export { FriendItem }
