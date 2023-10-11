import { Button } from '@/components/ui/Button'
import { z } from 'zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/Form'
import { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { FormInput, FormSelect } from '@/components/ui/CustomFormField'
import { StarRating } from '@/components/ui/StarRating'
import { useTitle } from '@/lib/use-title'
import { type Friend } from '@/api/fake/friend-api'

const whoIsPayingOptions = [
  { value: 'user', label: 'You' },
  { value: 'friend', label: 'friend' }
]

const formSchema = z
  .object({
    bill: z.coerce
      .number({ invalid_type_error: 'Bill must be a number' })
      .min(0, 'Bill must be greater than or equal to 0'),

    userExpense: z.coerce
      .number({ invalid_type_error: 'Expense must be a number' })
      .min(0, 'Expense must be greater than or equal to 0'),

    friendExpense: z.coerce
      .number({ invalid_type_error: 'Expense must be a number' })
      .min(0, 'Expense must be greater than or equal to 0'),

    whoIsPaying: z
      .string({ required_error: 'Must select who is paying the bill' })
      .trim()
      .refine(
        (value) => {
          return whoIsPayingOptions.map(({ value }) => value).includes(value)
        },
        {
          message: `Must be a valid option: ${whoIsPayingOptions
            .map(({ value }) => `"${value}"`)
            .join(', ')}`
        }
      )
  })
  .refine(({ userExpense, bill }) => userExpense <= bill, {
    message: 'Your expense must be less than or equal to the bill',
    path: ['userExpense']
  })
  .refine(
    ({ userExpense, friendExpense, whoIsPaying }) => {
      if (whoIsPaying === 'user' && userExpense > 0) {
        return true
      }

      return whoIsPaying === 'friend' && friendExpense > 0
    },
    {
      message: 'Must enter a valid expense',
      path: ['userExpense']
    }
  )

type FormSchema = z.infer<typeof formSchema>

type Bill = {
  friendId: Friend['id']
  expense: number
}

type FormSplitBillProps = {
  friend: Friend
  onSplitBill: (bill: Bill) => void
  onCreditRating: (rating: number) => void
}

function FormSplitBill({
  friend,
  onSplitBill,
  onCreditRating
}: FormSplitBillProps) {
  useTitle(`Split bill | ${friend.name}`)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bill: 0,
      userExpense: 0,
      friendExpense: 0,
      whoIsPaying: whoIsPayingOptions[0].value
    }
  })

  useWatchExpense(form)

  function onSubmit(values: FormSchema) {
    const bill = {
      friendId: friend.id,
      expense:
        values.whoIsPaying === 'user'
          ? -values.friendExpense
          : values.userExpense
    }

    onSplitBill(bill)

    form.reset()
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>Split bill, my friend</CardTitle>

        <CardDescription className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
          Split a bill with{' '}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-semibold text-cyan-500">
                  {friend.name}
                </span>
              </TooltipTrigger>

              <TooltipContent>{friend.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>

        <StarRating
          key={friend.id} // 为了避免共用组件 (在未关闭表单组件前)
          defaultRating={friend.creditRating}
          onRate={(rating) => onCreditRating(rating)}
          size="lg"
        />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              control={form.control}
              name="bill"
              type="number"
              label="💰 Bill value"
              labelWidth={160}
              placeholder="Bill value"
              isError={form.getFieldState('bill')?.invalid}
            />

            <FormInput
              control={form.control}
              name="userExpense"
              type="number"
              label="💸 Your expense"
              labelWidth={160}
              placeholder="Your expense"
              isError={form.getFieldState('userExpense')?.invalid}
            />

            <FormInput
              control={form.control}
              name="friendExpense"
              type="number"
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
              isError={form.getFieldState('whoIsPaying')?.invalid}
            />

            <Button type="submit" className="self-end">
              Split bill
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function useWatchExpense(form: UseFormReturn<FormSchema>) {
  const { watch, setValue } = form

  const bill = watch('bill')
  const userExpense = watch('userExpense')

  useEffect(() => {
    // 虽然通过 `zod` 的校验最终从 `handleSubmit` 得到的是 `number`, 但在这里的值却是 `string`
    // 所以需要转换一下
    const nBill = Number(bill)
    const nUserExpense = Number(userExpense)

    if (nUserExpense > nBill) {
      return
    }

    setValue('friendExpense', Number((nBill - nUserExpense).toFixed(2)))
  }, [bill, userExpense, setValue])
}

// 为测试校验, 添加一个不在 options 中的值
function getSelections(friend: string) {
  const options = whoIsPayingOptions.map(({ value, label }) => ({
    value,
    label: value === 'friend' ? friend : label
  }))

  options.push({ value: 'anonymous', label: 'Anonymous' })

  return options
}

export { FormSplitBill, type Bill }
