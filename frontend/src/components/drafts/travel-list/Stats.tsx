import Footer from "@/components/drafts/travel-list/Footer.tsx";
import { type PackingListProps } from "@/components/drafts/travel-list/types.ts";

export default function Stats({ items }: Pick<PackingListProps, "items">) {
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
