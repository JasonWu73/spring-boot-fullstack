import { Button } from "@/components/ui/Button.tsx";
import { type Friend } from "@/components/demo/eat-n-split/EatAndSplit.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar.tsx";
import classNames from "classnames";

type FriendListProps = {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend) => void;
};

export default function FriendList({ friends, selectedFriend, onSelectFriend }: FriendListProps) {
  return (
    <ul className="md:max-w-md">
      {friends.map((friend) => (
        <FriendItem
          key={friend.id}
          friend={friend}
          isSelected={friend.id === selectedFriend?.id}
          onSelectFriend={(friend) => onSelectFriend(friend)}
        />
      ))}
    </ul>
  );
}

type FriendItemProps = {
  friend: Friend;
  isSelected: boolean;
  onSelectFriend: (friend: Friend) => void;
};

function FriendItem({ friend, isSelected, onSelectFriend }: FriendItemProps) {
  return (
    <li
      className={classNames(
        "flex items-center justify-between gap-2 py-2 px-4 rounded hover:bg-amber-100 dark:hover:text-slate-700",
        { "bg-amber-100 dark:text-night-1": isSelected }
      )}
    >
      <Avatar>
        <AvatarImage src={friend.image} alt={friend.name} />
        <AvatarFallback>{friend.name}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h3 className="text-lg font-bold">{friend.name}</h3>

        {friend.balance > 0 && (
          <p className="text-green-500">
            {friend.name} owes you ${friend.balance}
          </p>
        )}

        {friend.balance < 0 && (
          <p className="text-red-500">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance === 0 && (
          <p>
            You and {friend.name} are even
          </p>
        )}
      </div>

      <Button onClick={() => onSelectFriend(friend)}>Select</Button>
    </li>
  );
}
