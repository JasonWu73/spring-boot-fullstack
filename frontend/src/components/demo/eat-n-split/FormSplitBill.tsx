import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { type Control, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { useEffect } from "react";
import { isNumber } from "@/lib/number.ts";
import { type Friend } from "./EatAndSplit";

const formSchema = z.object({
  bill: z.string().trim()
    .nonempty("Must enter a bill")
    .refine((value) => !Number.isNaN(Number(value)), "Bill must be a number")
    .refine((value) => Number(value) > 0, "Bill must be greater than 0"),
  userExpense: z.string().trim()
    .nonempty("Must enter your expense")
    .refine((value) => !Number.isNaN(Number(value)), "Expense must be a number")
    .refine((value) => Number(value) >= 0, "Expense must be greater or equal to 0"),
  friendExpense: z.string(),
  whoIsPaying: z.literal("user").or(z.literal("friend")).default("user")
})
  .refine((values) => Number(values.userExpense) <= Number(values.bill), {
    message: "Your expense must be less than or equal to the bill",
    path: ["userExpense"]
  });

type FormSchema = z.infer<typeof formSchema>;

export type Bill = {
  friendId: Friend["id"];
  expense: number;
};

type FormSplitBillProps = {
  friend: Friend;
  onSplitBill: (bill: Bill) => void;
};

export default function FormSplitBill({ friend, onSplitBill }: FormSplitBillProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bill: "",
      userExpense: "",
      friendExpense: "",
      whoIsPaying: "user"
    }
  });

  useWatchExpense(form);

  function onSubmit(values: FormSchema) {
    const userExpense = Number(values.userExpense);
    const friendExpense = Number(values.friendExpense);
    const whoIsPaying = values.whoIsPaying;

    const bill = {
      friendId: friend.id,
      expense: whoIsPaying === "user" ? -friendExpense : userExpense
    };

    onSplitBill(bill);

    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:max-w-md md:mt-16 mx-4 mb-8 p-8 bg-amber-100 text-slate-700 rounded border shadow flex flex-col gap-4 items-center justify-center"
      >
        <h2 className="text-2xl font-bold">Split a bill with {friend.name}</h2>

        <ControlledFormField
          control={form.control}
          name="bill"
          label="💰 Bill value"
          placeholder="Bill value"
        />

        <ControlledFormField
          control={form.control}
          name="userExpense"
          label="💸 Your expense"
          placeholder="Your expense"
        />

        <ControlledFormField
          control={form.control}
          name="friendExpense"
          label={`👫 ${friend.name}'s expense`}
          placeholder={`${friend.name}'s expense`}
          disabled
        />

        <FormField
          control={form.control}
          name="whoIsPaying"
          render={({ field }) => (
            <FormItem className="w-full lg:flex flex-wrap items-center justify-between">
              <FormLabel className="min-w-[180px]">🤑 Who is paying the bill</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl className="bg-white flex-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Who is paying the bill" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">You</SelectItem>
                  <SelectItem value="friend">{friend.name}</SelectItem>
                </SelectContent>
                <FormMessage className="w-full" />
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit" className="self-end">Split bill</Button>
      </form>
    </Form>
  );
}

type ControllerFormFieldProps = {
  control: Control<FormSchema>;
  name: "bill" | "userExpense" | "friendExpense" | "whoIsPaying";
  label: string;
  placeholder: string;
  disabled?: boolean;
};

function ControlledFormField({ control, name, label, placeholder, disabled }: ControllerFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full lg:flex flex-wrap items-center justify-between">
          <FormLabel className="min-w-[180px]">{label}</FormLabel>
          <FormControl className="bg-white flex-1">
            <Input placeholder={placeholder} {...field} disabled={disabled} />
          </FormControl>
          <FormMessage className="w-full" />
        </FormItem>
      )}
    />
  );
}

function useWatchExpense(form: UseFormReturn<FormSchema>) {
  const { watch, setValue } = form;

  const bill = watch("bill");
  const userExpense = watch("userExpense");

  useEffect(() => {
    if (!isNumber(bill) || !isNumber(userExpense)) {
      setValue("friendExpense", "");
      return;
    }

    const nBill = Number(bill);
    const nUserExpense = Number(userExpense);

    if (nUserExpense > nBill) {
      setValue("friendExpense", "0");
      return;
    }

    setValue("friendExpense", String(nBill - nUserExpense));
  }, [bill, userExpense, setValue]);
}