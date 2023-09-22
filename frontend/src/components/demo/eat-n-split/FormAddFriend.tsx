import InputItem from "@/components/ui/form/InputItem.tsx";
import Button from "@/components/ui/Button.tsx";
import { ReloadIcon } from "@radix-ui/react-icons";

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
        <Button>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Add
        </Button>
      </div>
    </form>
  );
}