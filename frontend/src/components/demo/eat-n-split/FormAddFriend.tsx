import Button from "@/components/ui/Button.tsx";
import FormItem from "@/components/ui/FormItem.tsx";

export default function FormAddFriend() {
  return (
    <form className="p-4 flex flex-col gap-4 rounded border shadow-sm bg-amber-100 text-slate-700">
      <FormItem fieldName="name" itemSize="sm">
        👫 Friend name
      </FormItem>

      <FormItem fieldName="image" itemSize="sm">
        🌄 Image URL
      </FormItem>

      <div className="self-end">
        <Button size="sm" className="w-28">Add</Button>
      </div>
    </form>
  );
}