import { Link, useParams } from 'react-router-dom'

import { cn, truncate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/Tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/AlertDialog'
import { buttonVariants } from '@/components/ui/Button'
import { type Friend } from '@/api/fake/friend-api'

type FriendItemProps = {
  friend: Friend
  onDeleteFriend: (friend: Friend) => void
}

function FriendItem({ friend, onDeleteFriend }: FriendItemProps) {
  const params = useParams()
  const selectedFriendId = Number(params.friendId)
  const isSelected = friend.id === selectedFriendId

  const name = truncate(friend.name, 5)

  return (
    <li
      className={cn(
        'group relative flex items-center justify-between gap-2 rounded px-4 py-2 hover:bg-amber-100 dark:hover:text-slate-700',
        { 'bg-amber-100 dark:text-night-1': isSelected }
      )}
    >
      <DeleteFriendButton onDelete={() => onDeleteFriend(friend)} />

      <Avatar>
        <AvatarImage src={friend.image} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-lg font-bold">{name}</span>
            </TooltipTrigger>

            <TooltipContent>{friend.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {friend.balance > 0 && (
          <p className="text-green-500">
            {name} owes you ${friend.balance}
          </p>
        )}

        {friend.balance < 0 && (
          <p className="text-red-500 dark:text-red-600">
            You owe {name} ${Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance === 0 && <p>You and {name} are even</p>}
      </div>

      <Link
        to={isSelected ? '/eat-split' : `/eat-split/${friend.id}`}
        className={buttonVariants({ variant: 'default' })}
      >
        {isSelected ? 'Close' : 'Select'}
      </Link>
    </li>
  )
}

type DeleteFriendButtonProps = {
  onDelete: () => void
}

function DeleteFriendButton({ onDelete }: DeleteFriendButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="absolute left-2 top-1 hidden text-xs group-hover:block">
        ❌
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            friend and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { FriendItem }
