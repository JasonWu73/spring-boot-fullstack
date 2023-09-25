import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/Form.tsx";
import { useEffect } from "react";
import { isNumeric } from "@/lib/utils.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Friend } from "@/components/demo/eat-n-split/friend-data.ts";
import { FormInput, FormSelect } from "@/components/ui/CustomFormField.tsx";

const whoIsPayingOptions = [{ value: "user", label: "You" }, { value: "friend", label: "friend" }];

const formSchema = z.object({
  bill: z.string().trim()
    .nonempty("Must enter a bill")
    .refine((value) => !Number.isNaN(Number(value)), "Bill must be a number")
    .refine((value) => Number(value) > 0, "Bill must be greater than 0"),

  userExpense: z.string().trim()
    .nonempty("Must enter your expense")
    .refine((value) => !Number.isNaN(Number(value)), "Expense must be a number")
    .refine((value) => Number(value) >= 0, "Expense must be greater than or equal to 0"),

  friendExpense: z.string().trim(),

  whoIsPaying: z.string({ required_error: "Must select who is paying the bill" })
    .refine((value) => {
      return whoIsPayingOptions.map(({ value }) => value).includes(value);
    }, "Must be either 'user' or 'friend'")
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
      // 下拉框组件时, 默认值设置为空字符串, 会导致 placeholder 不显示
      // 但不设置默认值, 又会在表单重置后, 依旧显示上次选择的值
      whoIsPaying: ""
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
    <Card className="md:w-[22rem] lg:w-[30rem] bg-amber-100 dark:bg-amber-100 dark:text-slate-700 text-slate-700">
      <CardHeader>
        <CardTitle>Split bill, my friend</CardTitle>
        <CardDescription className="max-w-xs whitespace-nowrap text-ellipsis overflow-hidden">
          Split a bill with{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-semibold text-cyan-500">{friend.name}</span>
              </TooltipTrigger>

              <TooltipContent>{friend.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput
              control={form.control}
              name="bill"
              type="text"
              label="💰 Bill value"
              labelWidth={160}
              placeholder="Bill value"
              isError={form.getFieldState("bill")?.invalid}
            />

            <FormInput
              control={form.control}
              name="userExpense"
              type="text"
              label="💸 Your expense"
              labelWidth={160}
              placeholder="Your expense"
              isError={form.getFieldState("userExpense")?.invalid}
            />

            <FormInput
              control={form.control}
              name="friendExpense"
              type="text"
              label={`👫 ${friend.name}'s expense`}
              labelWidth={160}
              placeholder={`${friend.name}'s expense`}
              disabled
            />

            <FormSelect
              control={form.control}
              name="whoIsPaying"
              label="🤑 Who is paying the bill"
              labelWidth={160}
              options={getSelections(friend.name)}
              placeholder="Who is paying the bill"
              isError={form.getFieldState("whoIsPaying")?.invalid}
            />

            <Button type="submit" className="self-end">Split bill</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
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

// 为测试校验, 添加一个不在 options 中的值
function getSelections(friend: string) {
  const options = whoIsPayingOptions.map(({ value, label }) => ({
    value,
    label: value === "friend" ? friend : label
  }));

  options.push({ value: "anonymous", label: "Anonymous" });

  return options;
}
