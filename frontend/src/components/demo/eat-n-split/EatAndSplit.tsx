import FriendList from "@/components/demo/eat-n-split/FriendList.tsx";
import FormSplitBill, { type Bill } from "@/components/demo/eat-n-split/FormSplitBill.tsx";
import { useState } from "react";
import FormAddFriend from "@/components/demo/eat-n-split/FormAddFriend.tsx";
import { Button } from "@/components/ui/Button.tsx";

const initialFriends = [
  {
    id: 1,
    name: "Lisa",
    image: "https://i.pravatar.cc/150?img=40",
    balance: -10.5
  },
  {
    id: 2,
    name: "Lucy",
    image: "https://i.pravatar.cc/400?img=29",
    balance: 8.8
  },
  {
    id: 3,
    name: "Lily",
    image: "https://i.pravatar.cc/400?img=24",
    balance: 0
  },
  {
    id: 4,
    name: "Emmanuelle",
    image: "https://i.pravatar.cc/400?img=23",
    balance: 0
  },
  {
    id: 5,
    name: "Bartholomew",
    image: "https://i.pravatar.cc/400?img=22",
    balance: 0
  },
  {
    id: 6,
    name: "Lola",
    image: "https://i.pravatar.cc/400?img=21",
    balance: 0
  },
  {
    id: 7,
    name: "Lara",
    image: "https://i.pravatar.cc/400?img=20",
    balance: 0
  }
];

export type Friend = typeof initialFriends[0];

export default function EatAndSplit() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  function handleAddFriend(friend: Friend) {
    setFriends((prev) => [...prev, friend]);
  }

  function handleToggleForm() {
    setShowAddFriend((prev) => !prev);
  }

  function handleSelectFriend(friend: Friend) {
    setShowAddFriend(false);
    setSelectedFriend(prev => prev?.id === friend.id ? null : friend);
  }

  function handleDeleteFriend(friend: Friend) {
    setFriends((prev) => prev.filter((prev) => prev.id !== friend.id));

    if (selectedFriend?.id === friend.id) {
      setSelectedFriend(null);
    }
  }

  function handleSplitBill(bill: Bill) {
    setFriends((prev) => prev.map((prev) => {
      if (prev.id === bill.friendId) {
        return {
          ...prev,
          balance: Number((prev.balance - bill.expense).toFixed(2))
        };
      }

      return prev;
    }));

    setSelectedFriend(null);
  }

  return (
    <div className="p-6 md:mt-16 grid grid-flow-row md:grid-rows-2 md:grid-cols-2 gap-6 items-center justify-center">
      <div className="md:row-span-1 md:col-span-1 md:justify-self-end">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
          onDeleteFriend={handleDeleteFriend}
        />
      </div>

      <div className="md:row-span-1 md:col-span-1 md:justify-self-end self-start flex flex-col gap-6">
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleToggleForm} className="self-end">
          {showAddFriend ? "Close" : "Add friend"}
        </Button>

      </div>

      <div className="md:row-start-1 md:row-end-2 md:col-start-2 md:col-end-3">
        {selectedFriend && <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />}
      </div>
    </div>
  );
}