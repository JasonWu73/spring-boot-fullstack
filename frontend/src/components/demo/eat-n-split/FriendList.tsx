import { Button } from "@/components/ui/Button.tsx";
import { type Friend } from "@/components/demo/eat-n-split/EatAndSplit.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar.tsx";
import classNames from "classnames";
import { Separator } from "@/components/ui/Separator.tsx";
import { ScrollArea } from "@/components/ui/ScrollArea.tsx";
import { truncate } from "@/lib/utils.ts";
import React from "react";

type FriendListProps = {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend) => void;
};

export default function FriendList({ friends, selectedFriend, onSelectFriend }: FriendListProps) {
  return (
    <ScrollArea className="h-96 w-96 rounded-md border">
      <ul>
        {friends.map((friend, index, array) => (
          <React.Fragment key={friend.id}>
            <FriendItem
              friend={friend}
              isSelected={friend.id === selectedFriend?.id}
              onSelectFriend={(friend) => onSelectFriend(friend)}
            />

            {index < array.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </ul>
    </ScrollArea>
  );
}

type FriendItemProps = {
  friend: Friend;
  isSelected: boolean;
  onSelectFriend: (friend: Friend) => void;
};

function FriendItem({ friend, isSelected, onSelectFriend }: FriendItemProps) {
  const name = truncate(friend.name, 5);

  return (
    <li
      className={classNames(
        "flex items-center justify-between gap-2 py-2 px-4 rounded hover:bg-amber-100 dark:hover:text-slate-700",
        { "bg-amber-100 dark:text-night-1": isSelected }
      )}
    >
      <Avatar>
        <AvatarImage src={friend.image} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      <div className="flex-1 w-32">
        <h3 className="text-lg font-bold">{name}</h3>

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
