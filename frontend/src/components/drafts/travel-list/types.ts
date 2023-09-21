import { initialItems } from "@/components/drafts/travel-list/TravelList.tsx";

export type PackingListProps = {
  items: typeof initialItems;
  onDeleteItem: (itemId: number) => void;
  onToggleItem: (itemId: number) => void;
  onClear: () => void;
};

export type SortBy = "input" | "description" | "packed";
