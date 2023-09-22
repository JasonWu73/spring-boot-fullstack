import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";

const formSchema = z.object({
  bill: z.coerce.number().min(0.1, { message: "Bill must be greater than 0" }),
  yourExpense: z.coerce.number().min(0.1, { message: "Expense must be greater than 0" }),
  friendExpense: z.coerce.number().min(0.1, { message: "Expense must be greater than 0" }),
  friend: z.string().min(2, { message: "Friend name must be at least 2 characters" })
});

export default function FormSplitBill() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bill: 0,
      yourExpense: 0,
      friendExpense: 0,
      friend: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:max-w-md md:mt-16 mx-4 mb-8 p-8 bg-amber-100 text-slate-700 rounded border shadow flex flex-col gap-4 items-center justify-center"
      >
        <h2 className="text-2xl font-bold">Split a bill with X</h2>

        <FormField
          control={form.control}
          name="bill"
          render={({ field }) => (
            <FormItem className="w-full lg:flex flex-wrap items-center justify-between">
              <FormLabel className="min-w-[180px]">💰 Bill value</FormLabel>
              <FormControl className="bg-white flex-1">
                <Input placeholder="Bill value" {...field} />
              </FormControl>
              <FormMessage className="w-full" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yourExpense"
          render={({ field }) => (
            <FormItem className="w-full lg:flex flex-wrap items-center justify-between">
              <FormLabel className="min-w-[180px]">💸 Your expense</FormLabel>
              <FormControl className="bg-white flex-1">
                <Input placeholder="Your expense" {...field} />
              </FormControl>
              <FormMessage className="w-full" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="friendExpense"
          render={({ field }) => (
            <FormItem className="w-full lg:flex flex-wrap items-center justify-between">
              <FormLabel className="min-w-[180px]">👫 X's expense</FormLabel>
              <FormControl className="bg-white flex-1">
                <Input placeholder="X's expense" {...field} />
              </FormControl>
              <FormMessage className="w-full" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="friend"
          render={({ field }) => (
            <FormItem className="w-full lg:flex flex-wrap items-center justify-between">
              <FormLabel className="min-w-[180px]">🤑 Who is paying the bill</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl className="bg-white flex-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Who is paying the bill" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage className="w-full" />
                <SelectContent>
                  <SelectItem value="user">You</SelectItem>
                  <SelectItem value="friend">X</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit" className="self-end">Split bill</Button>
      </form>
    </Form>
  );
}
