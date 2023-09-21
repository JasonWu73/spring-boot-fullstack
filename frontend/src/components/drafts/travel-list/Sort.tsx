import { useState } from "react";
import { type SortBy } from "@/components/drafts/travel-list/types.ts";

type SortProps = {
  onSort: (sortBy: SortBy) => void;
  onClear: () => void;
};

export default function Sort({ onSort, onClear }: SortProps) {
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

      <button
        onClick={onClear}
        className="ml-8 text-sm font-bold bg-amber-200 text-black px-4 py-2 rounded-full uppercase"
      >
        clear list
      </button>
    </div>
  );
}
