import { Link, useParams } from 'react-router-dom'

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
import { useFriends, type Friend } from '@/split-bill/FriendProvider'

type FriendItemProps = {
  friend: Friend
  onDeleteFriend: (friend: Friend) => void
}

export function FriendItem({ friend, onDeleteFriend }: FriendItemProps) {
  const params = useParams()

  const { dispatch } = useFriends()

  const friendId = Number(params.friendId)
  const selected = friend.id === friendId

  function handleToggleSelect() {
    dispatch({
      type: 'SHOW_ADD_FRIEND_FORM',
      payload: false
    })
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
        trigger={
          <button className="absolute left-2 top-1 hidden cursor-pointer text-xs group-hover:block">
            ❌
          </button>
        }
        title={
          <span>
            您确定要删除好友 <Code>{friend.name}</Code> 吗？
          </span>
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
            <Code>{name}</Code> 欠您 ${friend.balance}
          </p>
        )}

        {friend.balance < 0 && (
          <p className="text-red-500 dark:text-red-600">
            您欠 <Code>{name}</Code> ${Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance === 0 && (
          <p>
            你和 <Code>{name}</Code> 互不相欠
          </p>
        )}
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
