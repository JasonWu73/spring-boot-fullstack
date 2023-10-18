import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { FormInput, FormSelect } from '@/components/ui/CustomFormField'
import { Form } from '@/components/ui/Form'
import { StarRating } from '@/components/ui/StarRating'
import { FormSplitBillSkeleton } from '@/components/eat-n-split/FormSplitBillSkeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/Tooltip'
import { useTitle } from '@/lib/use-title'
import { type Friend } from '@/api/fake/friend'
import { useFriends } from '@/components/eat-n-split/FriendProvider'
import { FormSplitBillError } from '@/components/eat-n-split/FormSplitBillError'

const whoIsPayingOptions = [
  { value: 'user', label: '您' },
  { value: 'friend', label: '好友' }
]

const formSchema = z
  .object({
    bill: z.coerce
      .number({ invalid_type_error: '账单金额必须是数字' })
      .min(0, '账单金额必须大于或等于 0'),

    userExpense: z.coerce
      .number({ invalid_type_error: '费用必须是数字' })
      .min(0, '费用必须大于或等于 0'),

    friendExpense: z.coerce
      .number({ invalid_type_error: '费用必须是数字' })
      .min(0, '费用必须大于或等于 0'),

    whoIsPaying: z.string({ required_error: '必须选择谁支付账单' }).refine(
      (value) => {
        return whoIsPayingOptions.map(({ value }) => value).includes(value)
      },
      {
        message: `必须是有效的选项：${whoIsPayingOptions
          .map(({ value }) => `"${value}"`)
          .join(', ')}`
      }
    )
  })
  .refine(({ userExpense, bill }) => userExpense <= bill, {
    message: '您的费用必须小于或等于帐单',
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
      message: '必须输入有效的费用',
      path: ['userExpense']
    }
  )

type FormSchema = z.infer<typeof formSchema>

type Bill = {
  friendId: Friend['id']
  expense: number
}

function FormSplitBill() {
  useTitle('分摊账单')

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

  const { friends, updateFriend } = useFriends()

  const params = useParams()
  const friendId = Number(params.friendId)
  const friend = friends.find((f) => f.id === friendId)

  const { loading } = useChangeId(friendId, form.reset)

  const navigate = useNavigate()

  function onSubmit(values: FormSchema) {
    const bill = {
      friendId: friend!.id,
      expense:
        values.whoIsPaying === 'user'
          ? -values.friendExpense
          : values.userExpense
    }

    splitBill(bill)

    navigate('/eat-split', { replace: true })
  }

  function splitBill(bill: Bill) {
    if (!friend) {
      return
    }

    updateFriend({
      ...friend,
      balance: Number((friend.balance - bill.expense).toFixed(2))
    })
  }

  function handleCreditRating(creditRating: number) {
    if (!friend) {
      return
    }

    updateFriend({
      ...friend,
      creditRating
    })
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      {loading && <FormSplitBillSkeleton />}

      {!loading && !friend && <FormSplitBillError message="未找到好友数据" />}

      {!loading && friend && (
        <>
          <CardHeader>
            <CardTitle>分摊账单，我的朋友</CardTitle>

            <CardDescription className="flex gap-1">
              好友：
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <div className="font-semibold text-cyan-500">
                      {friend.name}
                    </div>
                  </TooltipTrigger>

                  <TooltipContent>{friend.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardDescription>

            <StarRating
              defaultRating={friend.creditRating}
              onRate={(rating) => handleCreditRating(rating)}
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
                  label="💰 账单金额"
                  labelWidth={160}
                  placeholder="账单金额"
                  isError={form.getFieldState('bill')?.invalid}
                />

                <FormInput
                  control={form.control}
                  name="userExpense"
                  type="number"
                  label="💸 您的费用"
                  labelWidth={160}
                  placeholder="您的费用"
                  isError={form.getFieldState('userExpense')?.invalid}
                />

                <FormInput
                  control={form.control}
                  name="friendExpense"
                  type="number"
                  label={`👫 ${friend.name} 的费用`}
                  labelWidth={160}
                  placeholder={`${friend.name} 的费用`}
                  disabled
                />

                <FormSelect
                  control={form.control}
                  name="whoIsPaying"
                  label="🤑 谁付帐单"
                  labelWidth={160}
                  options={getWhoIsPayingOptions(friend.name)}
                  isError={form.getFieldState('whoIsPaying')?.invalid}
                />

                <Button type="submit" className="self-end">
                  分摊账单
                </Button>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  )
}

// 为测试校验, 添加一个不在 options 中的值
function getWhoIsPayingOptions(friend: string) {
  const options = whoIsPayingOptions.map(({ value, label }) => ({
    value,
    label: value === 'friend' ? friend : label
  }))

  options.push({ value: 'anonymous', label: '匿名' })

  return options
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

function useChangeId(
  friendId: number,
  resetForm: (values?: Partial<FormSchema>) => void
) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    resetForm()

    // 仅为了模拟查看骨架屏的效果
    setLoading(true)

    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [friendId])

  return { loading }
}

export { FormSplitBill }
