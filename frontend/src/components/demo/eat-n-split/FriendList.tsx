import { type Friend } from "@/components/demo/eat-n-split/types.ts";
import Button from "@/components/ui/Button.tsx";
import FormAddFriend from "@/components/demo/eat-n-split/FormAddFriend.tsx";

type FriendListProps = {
  friends: Friend[];
};

type FriendItemProps = { friend: Friend };

export default function FriendList({ friends }: FriendListProps) {
  return (
    <div className="w-full md:max-w-lg md:ml-16 md:mt-16 md:flex md:justify-end dark:text-nord-400">
      <ul className="p-4 overflow-auto flex flex-col gap-4">
        {friends.map((friend) => (
          <FriendItem key={friend.id} friend={friend} />
        ))}

        <li>
          <FormAddFriend />
        </li>

        <li className="text-right">
          <Button label="Add friend" size="sm" />
        </li>
      </ul>
    </div>
  );
}

function FriendItem({ friend }: FriendItemProps) {
  return (
    <li className="flex items-center justify-between gap-2">
      <img src={friend.image} alt={friend.name} className="w-12 h-12 rounded-full border border-slate-400 shadow" />

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

      <Button label="Select" size="sm" />
    </li>
  );
}
