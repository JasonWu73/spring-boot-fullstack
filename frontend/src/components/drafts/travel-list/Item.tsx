import classNames from "classnames";
import { initialItems } from "@/components/drafts/travel-list/TravelList.tsx";

type ItemProps = {
  item: typeof initialItems[0];
  onDelete: (itemId: number) => void;
  onToggleItem: (itemId: number) => void;
};

export default function Item({ item, onDelete, onToggleItem }: ItemProps) {
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
