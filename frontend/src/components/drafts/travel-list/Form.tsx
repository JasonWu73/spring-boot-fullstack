import React, { useState } from "react";
import Button from "@/components/button/Button.tsx";
import { initialItems } from "@/components/drafts/travel-list/TravelList.tsx";

type FormProps = {
  onAddItem: (item: typeof initialItems[0]) => void;
};

export default function Form({ onAddItem }: FormProps) {
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  function handleAddItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!description) {
      return;
    }

    const newItem = {
      id: Date.now(),
      description,
      quantity,
      packed: false
    };

    onAddItem(newItem);

    setQuantity(1);
    setDescription("");
  }

  return (
    <form onSubmit={handleAddItem} className="bg-orange-500 text-gray-800 h-16 flex justify-center items-center">
      <h3 className="text-2xl font-bold tracking-wider">What do you need for your 🥰 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="ml-3 text-lg px-4 py-2 rounded bg-amber-100"
      >
        {new Array(20).fill(0).map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        name="description"
        placeholder="Item..."
        className="ml-3 px-4 py-2 text-lg rounded bg-amber-100"
      />
      <Button label="Add" className="ml-3 uppercase" />
    </form>
  );
}
