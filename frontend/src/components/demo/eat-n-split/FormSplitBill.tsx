import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { type Control, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { useEffect } from "react";
import { type Friend } from "./EatAndSplit";
import { isNumeric, truncate } from "@/lib/utils.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";

const formSchema = z.object({
  bill: z.string().trim()
    .nonempty("Must enter a bill")
    .refine((value) => !Number.isNaN(Number(value)), "Bill must be a number")
    .refine((value) => Number(value) > 0, "Bill must be greater than 0"),
  userExpense: z.string().trim()
    .nonempty("Must enter your expense")
    .refine((value) => !Number.isNaN(Number(value)), "Expense must be a number")
    .refine((value) => Number(value) >= 0, "Expense must be greater than or equal to 0"),
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

  const name = truncate(friend.name, 5);

  return (
    <Card className="w-full md:w-[22rem] lg:w-[30rem] bg-amber-100 dark:bg-amber-100 dark:text-slate-700 text-slate-700 p-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Split bill, my friend
        </CardTitle>
        <CardDescription>
          Split a bill with {" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="font-semibold text-cyan-500 cursor-text">{name}</TooltipTrigger>
              <TooltipContent>
                {friend.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <ControlledFormField
              control={form.control}
              name="bill"
              label="💰 Bill value"
              placeholder="Bill value"
              isError={form.getFieldState("bill")?.invalid}
            />

            <ControlledFormField
              control={form.control}
              name="userExpense"
              label="💸 Your expense"
              placeholder="Your expense"
              isError={form.getFieldState("userExpense")?.invalid}
            />

            <ControlledFormField
              control={form.control}
              name="friendExpense"
              label={`👫 ${name}'s expense`}
              placeholder={`${name}'s expense`}
              disabled
            />

            <FormField
              control={form.control}
              name="whoIsPaying"
              render={({ field }) => (
                <FormItem className="lg:flex lg:items-center lg:justify-center lg:flex-wrap">
                  <FormLabel className="min-w-[180px]">🤑 Who is paying the bill</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl className="bg-slate-100 lg:flex-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Who is paying the bill" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">You</SelectItem>
                      <SelectItem value="friend">{name}</SelectItem>
                    </SelectContent>
                    <FormMessage className="w-full" />
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" className="self-end">Split bill</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

type ControllerFormFieldProps = {
  control: Control<FormSchema>;
  name: "bill" | "userExpense" | "friendExpense" | "whoIsPaying";
  label: string;
  placeholder: string;
  disabled?: boolean;
  isError?: boolean;
};

function ControlledFormField({
  control,
  name,
  label,
  placeholder,
  disabled,
  isError
}: ControllerFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="lg:flex lg:items-center lg:justify-center lg:flex-wrap">
          <FormLabel className="min-w-[180px] lg:max-w-[40%] text-ellipsis overflow-hidden">{label}</FormLabel>
          <FormControl className="bg-slate-100 lg:flex-1">
            <Input type="text" placeholder={placeholder} {...field} disabled={disabled} isError={isError} />
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
    if (!isNumeric(bill) || !isNumeric(userExpense)) {
      return;
    }

    const nBill = Number(bill);
    const nUserExpense = Number(userExpense);

    if (nUserExpense > nBill) {
      return;
    }

    setValue("friendExpense", (nBill - nUserExpense).toFixed(2));
  }, [bill, userExpense, setValue]);
}