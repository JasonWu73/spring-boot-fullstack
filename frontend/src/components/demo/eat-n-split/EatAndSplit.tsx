import FriendList from "@/components/demo/eat-n-split/FriendList.tsx";
import FormSplitBill, { type Bill } from "@/components/demo/eat-n-split/FormSplitBill.tsx";
import { useState } from "react";
import FormAddFriend from "@/components/demo/eat-n-split/FormAddFriend.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { ScrollArea } from "@/components/ui/ScrollArea.tsx";

const initialFriends = [
  {
    id: 59,
    name: "Clark",
    image: "https://i.pravatar.cc/150?img=59",
    balance: -7
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 40,
    name: "Diana",
    image: "https://i.pravatar.cc/150?img=40",
    balance: 0
  },
  {
    id: 59,
    name: "Clark",
    image: "https://i.pravatar.cc/150?img=59",
    balance: -7
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "BruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruceBruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 8,
    name: "Bruce",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 20
  },
  {
    id: 40,
    name: "Diana",
    image: "https://i.pravatar.cc/150?img=40",
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
    <div className="p-4 grid md:grid-rows-2 md:grid-cols-2 gap-2 md:gap-4 items-center h-screen">
      <div className="md:row-span-1 md:col-span-1 justify-self-end">
        <ScrollArea className="h-96 md:w-[28rem] rounded-md border">
          <FriendList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelectFriend={handleSelectFriend}
          />
        </ScrollArea>
      </div>

      <div className="md:row-span-1 md:col-span-1 justify-self-end self-start flex flex-col justify-center gap-2 md:gap-4 md:w-[28rem]">
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