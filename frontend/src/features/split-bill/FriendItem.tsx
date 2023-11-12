import { Link, useParams } from 'react-router-dom'

import { DeleteFriend } from '@/features/split-bill/DeleteFriend'
import { useFriends } from '@/features/split-bill/FriendProvider'
import { type Friend } from '@/services/fake/friend-api'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/shadcn-ui/Avatar'
import { buttonVariants } from '@/ui/shadcn-ui/Button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/shadcn-ui/Tooltip'
import { cn, truncate } from '@/utils/helpers'

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
        selected && 'dark:text-night bg-amber-100'
      )}
    >
      <DeleteFriend onDelete={() => onDeleteFriend(friend)} />

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
        to={
          selected
            ? `/split-bill${queryStr}`
            : `/split-bill/${friend.id}${queryStr}`
        }
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
