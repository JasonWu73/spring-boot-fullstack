import classNames from "classnames";
import Button from "@/components/button/Button.tsx";
import React, { useState } from "react";

const initialItems = [
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

type ItemProps = {
  item: typeof initialItems[0];
  onDelete: (itemId: number) => void;
  onToggleItem: (itemId: number) => void;
};

type FormProps = {
  onAddItem: (item: typeof initialItems[0]) => void;
};

type PackingListProps = {
  items: typeof initialItems;
  onDeleteItem: (itemId: number) => void;
  onToggleItem: (itemId: number) => void;
};

type FooterProps = {
  children: React.ReactNode
};

type SortBy = "input" | "description" | "packed";

type SortProps = {
  onSort: (sortBy: SortBy) => void
};

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

  return (
    <div className="min-h-screen flex flex-col">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList items={items} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem} />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return (
    <div className="bg-amber-500 text-gray-800 h-20 flex justify-center items-center">
      <h1 className="text-4xl font-extrabold tracking-widest uppercase">🏝️ Far Away</h1>
    </div>
  );
}

function Form({ onAddItem }: FormProps) {
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

function PackingList({ items, onDeleteItem, onToggleItem }: PackingListProps) {
  const [sortBy, setSortBy] = useState<SortBy>("input");

  let sortedItems = items;

  if (sortBy === "description") {
    sortedItems = items.slice().sort((a, b) => a.description.localeCompare(b.description));
  }

  if (sortBy === "packed") {
    sortedItems = items.slice().sort((a, b) => (Number(a.packed) - Number(b.packed)));
  }

  return (
    <div className="self-stretch flex-grow bg-amber-900 text-slate-50 h-16 py-4 text-lg relative">
      <ul className="mx-24 flex flex-wrap gap-x-20 gap-y-8">
        {sortedItems.map((item) => (
          <Item key={item.id} item={item} onDelete={onDeleteItem} onToggleItem={onToggleItem} />
        ))}
      </ul>

      <Sort onSort={(sortBy) => setSortBy(sortBy)} />
    </div>
  );
}

function Item({ item, onDelete, onToggleItem }: ItemProps) {
  return (
    <li className="flex items-center justify-center gap-2">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={item.packed}
          onChange={() => onToggleItem(item.id)}
          className="w-4 h-4 accent-amber-500"
        />
        <span className={classNames({ "line-through": item.packed })}>
        {item.quantity} {item.description}
      </span>
      </label>

      <button onClick={() => onDelete(item.id)} className="text-sm h-4">❌</button>
    </li>
  );
}

function Sort({ onSort }: SortProps) {
  const [sortBy, setSortBy] = useState<SortBy>("input");

  return (
    <div className="absolute bottom-8 w-full text-center">
      <select
        value={sortBy}
        onChange={(e) => {
          const sortByOption = e.target.value;

          sortByOption === "input" && setSortBy("input");
          sortByOption === "input" && onSort("input");

          sortByOption === "description" && setSortBy("description");
          sortByOption === "description" && onSort("description");

          sortByOption === "packed" && setSortBy("packed");
          sortByOption === "packed" && onSort("packed");
        }}
        className="text-sm font-bold bg-amber-200 text-black px-4 py-2 rounded-full uppercase"
      >
        <option value="input">sort by input order</option>
        <option value="description">sort by description</option>
        <option value="packed">sort by packed status</option>
      </select>

      <button className="ml-8 text-sm font-bold bg-amber-200 text-black px-4 py-2 rounded-full uppercase">clear list
      </button>
    </div>
  );
}

function Stats({ items }: Pick<PackingListProps, "items">) {
  if (!items.length) {
    return (
      <Footer>
        <em>Start adding some items to your packing list 🚀</em>
      </Footer>
    );
  }

  const packedItems = items.filter(item => item.packed);
  const packedPercent = Math.round(packedItems.length / items.length * 100);

  return (
    <Footer>
      <em className="text-lg font-semibold">
        {packedPercent === 100
          ? "You got everything! Ready to go 🚀"
          : `💼 You have ${items.length} items on your list, and you already packed ${packedItems.length} (${packedPercent}%)`}
      </em>
    </Footer>
  );
}

function Footer({ children }: FooterProps) {
  return <footer className="bg-cyan-500 text-gray-800 h-16 flex justify-center items-center">{children}</footer>;
}