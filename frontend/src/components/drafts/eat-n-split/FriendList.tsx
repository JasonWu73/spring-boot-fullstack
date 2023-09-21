import { type Friend } from "@/components/drafts/eat-n-split/types.ts";
import Button from "@/components/button/Button.tsx";

type FriendListProps = {
  friends: Friend[];
};

type FriendItemProps = { friend: Friend };

export default function FriendList({ friends }: FriendListProps) {
  return (
    <div className="my-16 flex justify-center dark:text-nord-400">
      <ul className="min-w-[300px] flex flex-col gap-4">
        {friends.map((friend) => (
          <FriendItem key={friend.id} friend={friend} />
        ))}
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
