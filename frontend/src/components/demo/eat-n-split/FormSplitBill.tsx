import InputItem from "@/components/ui/form/InputItem.tsx";
import SelectItem from "@/components/ui/form/SelectItem.tsx";
import { Button } from "@/components/ui/Button.tsx";

export default function FormSplitBill() {
  return (
    <form className="max-w-lg md:mt-16 mx-4 mb-8 p-8 bg-amber-100 text-slate-700 rounded border shadow flex flex-col gap-4 items-center justify-center">
      <h2 className="text-2xl font-bold">Split a bill with X</h2>

      <InputItem itemSize="sm" labelClass="w-[180px]">
        💰 Bill value
      </InputItem>

      <InputItem itemSize="sm" labelClass="w-[180px]">
        🧍‍♂️ Your expense
      </InputItem>

      <InputItem itemSize="sm" labelClass="w-[180px]" disabled>
        👫 X's expense
      </InputItem>

      <SelectItem
        options={[
          { value: "user", label: "You" },
          { value: "friend", label: "X" }
        ]}
        itemSize="sm"
        labelClass="w-[180px]"
      >
        🤑 Who is paying the bill
      </SelectItem>

      <div className="self-end">
        <Button>Split bill</Button>
      </div>
      ;
    </form>
  )
    ;
}
