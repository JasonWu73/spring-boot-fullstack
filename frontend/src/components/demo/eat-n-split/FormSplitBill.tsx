import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";

const formSchema = z.object(
  {
    bill: z.number().min(0, { message: "Bill must be greater than 0" }),
    yourExpense: z.number().min(0, { message: "Expense must be greater than 0" }),
    friendExpense: z.number().min(0, { message: "Expense must be greater than 0" })
  }
);

export default function FormSplitBill() {
  const form = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        bill: 0,
        yourExpense: 0,
        friendExpense: 0
      }
    }
  );

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-lg md:mt-16 mx-4 mb-8 p-8 bg-amber-100 text-slate-700 rounded border shadow flex flex-col gap-4 items-center justify-center"
      >
        <h2 className="text-2xl font-bold">Split a bill with X</h2>

        <FormField
          control={form.control}
          name="bill"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>💰 Bill value</FormLabel>
                <FormControl>
                  <Input placeholder="Bill value" {...field} />
                </FormControl>
              </FormItem>
            )
          }
        />

        <FormField
          control={form.control}
          name="yourExpense"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>🧍‍♂️ Your expense</FormLabel>
                <FormControl>
                  <Input placeholder="Your expense" {...field} />
                </FormControl>
              </FormItem>
            )
          }
        />

        <FormField
          control={form.control}
          name="friendExpense"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>👫 X's expense</FormLabel>
                <FormControl>
                  <Input placeholder="X's expense" {...field} />
                </FormControl>
              </FormItem>
            )
          }
        />

        {/*
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
        */}

        <div className="self-end">
          <Button type="submit">Split bill</Button>
        </div>
      </form>
    </Form>
  );
}
