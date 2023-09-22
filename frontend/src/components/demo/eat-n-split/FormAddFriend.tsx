import InputItem from "@/components/ui/form/InputItem.tsx";
import Button from "@/components/ui/Button.tsx";

export default function FormAddFriend() {
  return (
    <form className="p-4 flex flex-col gap-4 rounded border shadow-sm bg-amber-100 text-slate-700">
      <InputItem itemSize="sm">
        👫 Friend name
      </InputItem>

      <InputItem itemSize="sm">
        🌄 Image URL
      </InputItem>

      <div className="self-end">
        <Button>Add</Button>
      </div>
    </form>
  );
}