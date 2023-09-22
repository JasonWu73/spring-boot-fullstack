import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { type Control, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { useEffect } from "react";

const formSchema = z.object({
  bill: z.string().trim()
    .nonempty("Must enter a bill")
    .refine((value) => !Number.isNaN(Number(value)), "Bill must be a number")
    .refine((value) => Number(value) > 0, "Bill must be greater than 0"),
  yourExpense: z.string().trim()
    .nonempty("Must enter your expense")
    .refine((value) => !Number.isNaN(Number(value)), "Expense must be a number")
    .refine((value) => Number(value) >= 0, "Expense must be greater or equal to 0"),
  friendExpense: z.string(),
  who: z.literal("user").or(z.literal("friend")).default("user")
})
  .refine((values) => Number(values.yourExpense) <= Number(values.bill), {
    message: "Your expense must be less than or equal to the bill",
    path: ["yourExpense"]
  });

type FormSchema = z.infer<typeof formSchema>;

export default function FormSplitBill() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bill: "",
      yourExpense: "",
      friendExpense: "",
      who: "user"
    }
  });

  useWatchExpense(form);

  function onSubmit(values: FormSchema) {
    const bill = Number(values.bill);
    const yourExpense = Number(values.yourExpense);
    const friendExpense = Number(values.friendExpense);
    const who = values.who;

    console.log(form.formState.isValid, { bill, yourExpense, friendExpense, who });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:max-w-md md:mt-16 mx-4 mb-8 p-8 bg-amber-100 text-slate-700 rounded border shadow flex flex-col gap-4 items-center justify-center"
      >
        <h2 className="text-2xl font-bold">Split a bill with X</h2>

        <ControllerFormField
          control={form.control}
          name="bill"
          label="💰 Bill value"
          placeholder="Bill value"
        />

        <ControllerFormField
          control={form.control}
          name="yourExpense"
          label="💸 Your expense"
          placeholder="Your expense"
        />

        <ControllerFormField
          control={form.control}
          name="friendExpense"
          label="👫 X's expense"
          placeholder="X's expense"
          disabled
        />

        <FormField
          control={form.control}
          name="who"
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

type ControllerFormFieldProps = {
  control: Control<FormSchema>;
  name: "bill" | "yourExpense" | "friendExpense" | "who";
  label: string;
  placeholder: string;
  disabled?: boolean;
};

function ControllerFormField({ control, name, label, placeholder, disabled }: ControllerFormFieldProps) {
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
  const yourExpense = watch("yourExpense");

  useEffect(() => {
    const billNumber = Number(bill);
    const yourExpenseNumber = Number(yourExpense);

    if (bill.trim() === "" || Number.isNaN(billNumber) || Number.isNaN(yourExpenseNumber)) {
      setValue("friendExpense", "");
      return;
    }

    if (yourExpenseNumber > billNumber) {
      setValue("friendExpense", "0");
      return;
    }

    setValue("friendExpense", String(billNumber - yourExpenseNumber));
  }, [bill, yourExpense, setValue]);
}