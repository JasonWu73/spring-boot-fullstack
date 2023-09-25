import { Friend } from "@/components/demo/eat-n-split/friend-data.ts";
import { cn, truncate } from "@/lib/utils.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Button } from "@/components/ui/Button.tsx";
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
} from "@/components/ui/AlertDialog.tsx";

type FriendItemProps = {
  friend: Friend;
  isSelected: boolean;
  onSelectFriend: (friend: Friend) => void;
  onDeleteFriend: (friend: Friend) => void;
};

export default function FriendItem({ friend, isSelected, onSelectFriend, onDeleteFriend }: FriendItemProps) {
  const name = truncate(friend.name, 5);

  return (
    <li
      className={cn(
        "group relative flex justify-between items-center gap-2 py-2 px-4 rounded hover:bg-amber-100 dark:hover:text-slate-700",
        { "bg-amber-100 dark:text-night-1": isSelected }
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
          <p className="text-red-500">
            You owe {name} ${Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance === 0 && (
          <p>
            You and {name} are even
          </p>
        )}
      </div>

      <Button onClick={() => onSelectFriend(friend)}>{isSelected ? "Deselect" : "Select"}</Button>
    </li>
  );
}

type DeleteFriendButtonProps = {
  onDelete: () => void;
};

function DeleteFriendButton({ onDelete }: DeleteFriendButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="absolute top-1 left-2 text-xs hidden group-hover:block">❌</AlertDialogTrigger>

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
  );
}
