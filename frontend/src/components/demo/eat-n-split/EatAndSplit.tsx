import FriendList from "@/components/demo/eat-n-split/FriendList.tsx";
import FormSplitBill from "@/components/demo/eat-n-split/FormSplitBill.tsx";
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
    <div className="h-screen grid grid-flow-row md:grid-rows-1 md:grid-cols-2 md:gap-16">
      <div className="min-w-min row-span-1 col-span-1 md:flex md:justify-end">
        <FriendList friends={friends} />
      </div>

      <div className="min-w-min row-span-1 col-span-1">
        <FormSplitBill />
      </div>
    </div>
  );
}