import FormItem from "@/components/ui/FormItem.tsx";
import Button from "@/components/ui/Button.tsx";

export default function FormSplitBill() {
  return (
    <form className="max-w-lg md:mt-16 mx-4 mb-8 p-8 bg-amber-100 text-slate-700 rounded border shadow flex flex-col gap-4 items-center justify-center">
      <h2 className="text-2xl font-bold">Split a bill with X</h2>

      <FormItem itemSize="sm">
        💰 Bill value
      </FormItem>

      <FormItem itemSize="sm">
        🧍‍♂️ Your expense
      </FormItem>

      <FormItem itemSize="sm">
        👫 X's expense
      </FormItem>

      <div className="self-end">
        <Button size="sm" className="w-28">Split bill</Button>
      </div>
    </form>
  );
}
