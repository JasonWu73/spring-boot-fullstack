import FormAddFriend from "@/components/demo/eat-n-split/FormAddFriend.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { type Friend } from "@/components/demo/eat-n-split/EatAndSplit.tsx";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar.tsx";
import classNames from "classnames";

type FriendListProps = {
  friends: Friend[];
  onAddFriend: (friend: Friend) => void;
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend) => void;
};

export default function FriendList({ friends, onAddFriend, selectedFriend, onSelectFriend }: FriendListProps) {
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleAddFriend(friend: Friend) {
    onAddFriend(friend);
    setShowAddFriend(false);
  }

  function handleSelectFriend(friend: Friend) {
    onSelectFriend(friend);
    setShowAddFriend(false);
  }

  return (
    <div className="w-full md:max-w-lg md:ml-16 md:mt-16 md:flex md:justify-end">
      <ul className="p-4 w-full overflow-auto flex flex-col">
        {friends.map((friend) => (
          <FriendItem
            key={friend.id}
            friend={friend}
            isSelected={friend.id === selectedFriend?.id}
            onSelectFriend={handleSelectFriend}
          />
        ))}

        {showAddFriend && (
          <li className="mt-4">
            <FormAddFriend onAddFriend={handleAddFriend} />
          </li>
        )}

        <li className="mt-4 text-right">
          <Button onClick={() => setShowAddFriend((prevShowAddFriend) => !prevShowAddFriend)}>
            {showAddFriend ? "Close" : "Add friend"}
          </Button>
        </li>
      </ul>
    </div>
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
        "px-4 py-2 rounded flex items-center justify-between gap-2 hover:bg-amber-100 dark:hover:text-night-1",
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
