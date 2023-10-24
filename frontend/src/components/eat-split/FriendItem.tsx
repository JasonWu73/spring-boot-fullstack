import { Link, useParams } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/Tooltip'
import { buttonVariants } from '@/components/ui/Button'
import { ButtonDeleteFriend } from '@/components/eat-split/ButtonDeleteFriend'
import { cn, truncate } from '@/lib/utils'
import { type Friend } from '@/api/fake/friend'
import { useFriends } from '@/components/eat-split/FriendProvider'

type FriendItemProps = {
  friend: Friend
  onDeleteFriend: (friend: Friend) => void
}

function FriendItem({ friend, onDeleteFriend }: FriendItemProps) {
  const params = useParams()
  const selectedFriendId = Number(params.friendId)
  const isSelected = friend.id === selectedFriendId

  const name = truncate(friend.name, 5)

  const { setShowAddFriend } = useFriends()

  const queryStr = window.location.search

  function handleToggleSelect() {
    setShowAddFriend(false)
  }

  return (
    <li
      className={cn(
        'group relative flex items-center justify-between gap-2 rounded px-4 py-2 hover:bg-amber-100 dark:hover:text-slate-700',
        { 'bg-amber-100 dark:text-night-1': isSelected }
      )}
    >
      <ButtonDeleteFriend onDelete={() => onDeleteFriend(friend)} />

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
          isSelected
            ? `/eat-split${queryStr}`
            : `/eat-split/${friend.id}${queryStr}`
        }
        state={{
          noRefresh: true
        }}
        onClick={handleToggleSelect}
        className={buttonVariants({ variant: 'default' })}
      >
        {isSelected ? '关闭' : '选择'}
      </Link>
    </li>
  )
}

export { FriendItem }
