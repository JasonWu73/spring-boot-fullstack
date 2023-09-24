import { Button } from "@/components/ui/Button.tsx";
import { type Friend } from "@/components/demo/eat-n-split/EatAndSplit.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar.tsx";
import classNames from "classnames";
import { Separator } from "@/components/ui/Separator.tsx";
import { ScrollArea } from "@/components/ui/ScrollArea.tsx";
import { truncate } from "@/lib/utils.ts";
import React from "react";
import { Card } from "@/components/ui/Card.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert.tsx";
import { RocketIcon } from "@radix-ui/react-icons";

type FriendListProps = {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend) => void;
  onDeleteFriend: (friend: Friend) => void;
};

export default function FriendList({ friends, selectedFriend, onSelectFriend, onDeleteFriend }: FriendListProps) {
  return (
    <Card>
      <ScrollArea className="h-96 md:h-[30rem] lg:h-[24rem] w-full md:w-[22rem] lg:w-[30rem]">
        <div className="p-4">
          {friends.length === 0 && (
            <Alert>
              <RocketIcon className="w-4 h-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                No friends yet. Add a friend to split a bill.
              </AlertDescription>
            </Alert>
          )}

          {friends.length > 0 && (
            <ul>
              {friends.map((friend, index, array) => (
                <React.Fragment key={friend.id}>
                  <FriendItem
                    friend={friend}
                    isSelected={friend.id === selectedFriend?.id}
                    onSelectFriend={onSelectFriend}
                    onDeleteFriend={onDeleteFriend}
                  />

                  {index < array.length - 1 && <Separator className="my-2" />}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

type FriendItemProps = {
  friend: Friend;
  isSelected: boolean;
  onSelectFriend: (friend: Friend) => void;
  onDeleteFriend: (friend: Friend) => void;
};

function FriendItem({ friend, isSelected, onSelectFriend, onDeleteFriend }: FriendItemProps) {
  const name = truncate(friend.name, 5);

  return (
    <li
      className={classNames(
        "flex items-center justify-between gap-2 py-2 px-4 rounded hover:bg-amber-100 dark:hover:text-slate-700 relative group",
        { "bg-amber-100 dark:text-night-1": isSelected }
      )}
    >
      <DeleteFriendButton onDelete={() => onDeleteFriend(friend)} />

      <Avatar>
        <AvatarImage src={friend.image} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      <div className="flex-1 w-32">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-lg font-bold cursor-text">{name}</TooltipTrigger>
            <TooltipContent>
              {friend.name}
            </TooltipContent>
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

      <Button onClick={() => onSelectFriend(friend)}>Select</Button>
    </li>
  );
}

type DeleteFriendButtonProps = {
  onDelete: () => void;
};

function DeleteFriendButton({ onDelete }: DeleteFriendButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="absolute top-1 left-2 text-xs hidden group-hover:block">❌</button>
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
  );
}
