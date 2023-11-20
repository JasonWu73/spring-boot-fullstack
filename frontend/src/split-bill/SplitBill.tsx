import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { StarRating } from '@/shared/components/StarRating'
import { Button } from '@/shared/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { FormInput, FormSelect } from '@/shared/components/ui/CustomFormField'
import { Form } from '@/shared/components/ui/Form'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/components/ui/Tooltip'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { useFriends } from '@/split-bill/FriendProvider'
import { SplitBillError } from '@/split-bill/SplitBillError'
import { SplitBillSkeleton } from '@/split-bill/SplitBillSkeleton'

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

    whoIsPaying: z
      .string({ required_error: '必须选择谁支付账单' })
      .refine((value) => whoIsPayingOptions.map(({ value }) => value).includes(value), {
        message: '必须是有效的选项：您 或 好友'
      })
  })
  .refine(({ userExpense, bill }) => userExpense <= bill, {
    message: '您的费用必须小于或等于帐单',
    path: ['userExpense']
  })
  .refine(
    ({ userExpense, friendExpense, whoIsPaying }) => {
      if (whoIsPaying === 'user' && userExpense > 0) return true

      return whoIsPaying === 'friend' && friendExpense > 0
    },
    {
      message: '必须输入有效的费用',
      path: ['userExpense']
    }
  )

type FormSchema = z.infer<typeof formSchema>

function SplitBill() {
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

  // 更新好友的花费
  const watchedBill = form.watch('bill')
  const watchedUserExpense = form.watch('userExpense')

  React.useEffect(() => {
    // 虽然通过 `Zod` 的校验最终从 `handleSubmit` 得到的是 `number`，但在这里的值仍然是 `string`，所以需要转换
    const bill = Number(watchedBill)
    const userExpense = Number(watchedUserExpense)
    if (userExpense > bill) return

    form.setValue('friendExpense', Number((bill - userExpense).toFixed(2)))
  }, [watchedBill, watchedUserExpense, form])

  // 因为是假 API，所以会导致 loading 时还是显示上次的数据，为了避免页面闪烁，所以这里需要重置一下
  const ctx = useFriends()
  const { loadingFriend: loading, getFriend, setCredit, splitBill } = ctx
  let { curFriend: friend, errorFriend: error } = ctx

  if (loading) {
    error = ''
    friend = null
  }

  const params = useParams()
  const id = Number(params.friendId)

  useRefresh(() => {
    form.reset()
    const ignore = getFriend({ id })

    return () => {
      ignore()
    }
  })

  const navigate = useNavigate()

  function onSubmit(values: FormSchema) {
    const expense =
      values.whoIsPaying === 'user' ? -values.friendExpense : values.userExpense

    splitBill(id, expense)

    navigate(`/split-bill${window.location.search}`, {
      state: { noRefresh: true }
    })
  }

  function handleCreditRating(creditRating: number) {
    setCredit(id, creditRating)
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      {loading && <SplitBillSkeleton />}

      {error && <SplitBillError message={error} />}

      {friend && (
        <>
          <CardHeader>
            <CardTitle>与好友分摊账单</CardTitle>

            <CardDescription className="flex gap-1">
              好友：
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <div className="font-semibold text-cyan-500">{friend.name}</div>
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
                  className="bg-slate-50"
                />

                <FormInput
                  control={form.control}
                  name="userExpense"
                  type="number"
                  label="💸 您的费用"
                  labelWidth={160}
                  placeholder="您的费用"
                  isError={form.getFieldState('userExpense')?.invalid}
                  className="bg-slate-50"
                />

                <FormInput
                  control={form.control}
                  name="friendExpense"
                  type="number"
                  label={`👫 ${friend.name} 的费用`}
                  labelWidth={160}
                  placeholder={`${friend.name} 的费用`}
                  className="bg-slate-50"
                  disabled
                />

                <FormSelect
                  control={form.control}
                  name="whoIsPaying"
                  label="🤑 谁付帐单"
                  labelWidth={160}
                  options={getWhoIsPayingOptions(friend.name)}
                  isError={form.getFieldState('whoIsPaying')?.invalid}
                  className="bg-slate-50"
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

  // 添加一个额外选项，用于测试表单校验
  options.push({ value: 'anonymous', label: '匿名' })
  return options
}

export { SplitBill }
