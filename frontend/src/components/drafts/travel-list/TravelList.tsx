import { useState } from "react";
import Logo from "@/components/drafts/travel-list/Logo.tsx";
import Form from "@/components/drafts/travel-list/Form.tsx";
import PackingList from "@/components/drafts/travel-list/PackingList.tsx";
import Stats from "@/components/drafts/travel-list/Stats.tsx";

export const initialItems = [
  {
    id: 1,
    description: "Passports",
    quantity: 2,
    packed: false
  },
  {
    id: 2,
    description: "Socks",
    quantity: 12,
    packed: true
  },
  {
    id: 3,
    description: "Charger",
    quantity: 1,
    packed: false
  }
];

export default function TravelList() {
  const [items, setItems] = useState(initialItems);

  function handleAddItem(item: typeof initialItems[0]) {
    setItems((prevItems) => [...prevItems, item]);
  }

  function handleDeleteItem(itemId: number) {
    setItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  }

  function handleToggleItem(itemId: number) {
    setItems((prevItems) => prevItems.map(item => {
      if (item.id !== itemId) {
        return item;
      }

      return {
        ...item,
        packed: !item.packed
      };
    }));
  }

  function handleClearItems() {
    const isConfirmed = window.confirm("Are you sure you want to clear your list?");
    isConfirmed && setItems([]);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClear={handleClearItems}
      />
      <Stats items={items} />
    </div>
  );
}