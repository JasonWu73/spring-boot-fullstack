import FormAddFriend from "@/components/demo/eat-n-split/FormAddFriend.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { type Friend } from "@/components/demo/eat-n-split/EatAndSplit.tsx";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar.tsx";

type FriendListProps = {
  friends: Friend[];
  onAddFriend: (friend: Friend) => void;
};

type FriendItemProps = {
  friend: Friend
};

export default function FriendList({ friends, onAddFriend }: FriendListProps) {
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleAddFriend(friend: Friend) {
    onAddFriend(friend);
    setShowAddFriend(false);
  }

  return (
    <div className="w-full md:max-w-lg md:ml-16 md:mt-16 md:flex md:justify-end">
      <ul className="p-4 w-full overflow-auto flex flex-col gap-4">
        {friends.map((friend) => (<FriendItem key={friend.id} friend={friend} />))}

        {showAddFriend && (
          <li>
            <FormAddFriend onAddFriend={handleAddFriend} />
          </li>
        )}

        <li className="text-right">
          <Button onClick={() => setShowAddFriend((prevState) => !prevState)}>
            {showAddFriend ? "Close" : "Add friend"}
          </Button>
        </li>
      </ul>
    </div>
  );
}

function FriendItem({ friend }: FriendItemProps) {
  return (
    <li className="flex items-center justify-between gap-2">
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

      <Button>Select</Button>
    </li>
  );
}
