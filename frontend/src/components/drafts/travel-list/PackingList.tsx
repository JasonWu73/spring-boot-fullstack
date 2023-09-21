import { useState } from "react";
import Item from "@/components/drafts/travel-list/Item.tsx";
import { type PackingListProps, type SortBy } from "@/components/drafts/travel-list/types.ts";
import Sort from "@/components/drafts/travel-list/Sort.tsx";

export default function PackingList({ items, onDeleteItem, onToggleItem, onClear }: PackingListProps) {
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

      <Sort
        onSort={(sortBy) => setSortBy(sortBy)}
        onClear={onClear}
      />
    </div>
  );
}
