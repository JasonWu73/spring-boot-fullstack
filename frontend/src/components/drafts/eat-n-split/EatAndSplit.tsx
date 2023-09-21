import FriendList from "@/components/drafts/eat-n-split/FriendList.tsx";
import NewBill from "@/components/drafts/eat-n-split/NewBill.tsx";
import NewFriend from "@/components/drafts/eat-n-split/NewFriend.tsx";
import { useState } from "react";

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
    id: 40,
    name: "Diana",
    image: "https://i.pravatar.cc/150?img=40",
    balance: 0
  }
];

export default function EatAndSplit() {
  const [friends, setFriends] = useState(initialFriends);

  return (
    <div className="h-screen grid grid-rows-2 grid-cols-2 gap-4">
      <div className="row-span-1 col-span-1">
        <FriendList friends={friends} />
      </div>
      <div className="row-span-2 col-span-1">
        <NewBill />
      </div>
      <div className="row-span-1 col-span-1">
        <NewFriend />
      </div>
    </div>
  );
}