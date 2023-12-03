import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

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
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { StarRating } from '@/shared/components/ui/StarRating'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/components/ui/Tooltip'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import type { ApiRequest } from '@/shared/utils/fetch'
import { wait } from '@/shared/utils/helpers'
import { endNProgress, startNProgress } from '@/shared/utils/nprogress'
import { getFriendsFromStorage, useFriends } from '@/split-bill/FriendProvider'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

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

const defaultValues: FormSchema = {
  bill: 0,
  userExpense: 0,
  friendExpense: 0,
  whoIsPaying: whoIsPayingOptions[0].value
}

function SplitBill() {
  useTitle('分摊账单')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues
  })
  const params = useParams()
  const navigate = useNavigate()

  const friendId = Number(params.friendId)

  useWatchFriendExpense(form) // 更新好友的费用

  const {
    data: friend,
    error,
    loading,
    fetchData,
    updateState
  } = useFetch(getFriendFakeApi)
  const { dispatch } = useFriends()

  useRefresh(() => {
    form.reset()

    getFriend().then(({ data, error }) => {
      if (error) {
        dispatch({ type: 'SELECT_FRIEND', payload: null })

        return
      }

      if (data) {
        dispatch({ type: 'SELECT_FRIEND', payload: data })
      }
    })
  })

  async function getFriend() {
    return await fetchData({ url: '/fake', urlParams: { id: friendId } })
  }

  function onSubmit(values: FormSchema) {
    const expense =
      values.whoIsPaying === 'user' ? -values.friendExpense : values.userExpense

    dispatch({ type: 'SPLIT_BILL', payload: { id: friendId, expense } })

    navigate(`/split-bill${window.location.search}`, {
      state: { noRefresh: true }
    })
  }

  function handleCreditRating(creditRating: number) {
    dispatch({ type: 'RATE_CREDIT_RANK', payload: { id: friendId, creditRating } })
  }

  async function getFriendFakeApi(params: ApiRequest) {
    startNProgress()

    updateState((prevState) => {
      return { ...prevState, loading: true }
    })

    // 仅为了模拟查看骨架屏的效果
    await wait(2)

    const friends = getFriendsFromStorage()
    const friend = friends.find((friend) => friend.id === Number(params.urlParams!.id))

    endNProgress()

    updateState((prevState) => {
      return { ...prevState, loading: false }
    })

    if (friend) return { status: 200, data: friend }

    return { status: 404, error: '未找到好友数据' }
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      {loading && <FormSkeleton />}

      {!loading && error && <SplitBillError message={error} />}

      {!loading && !error && friend && (
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

function FormSkeleton() {
  return (
    <>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-[300px]" />
        </CardTitle>
        <CardDescription className="space-y-2">
          <Skeleton className="h-5 w-[300px]" />
          <Skeleton className="h-6 w-[200px]" />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]"
          >
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8" />
          </div>
        ))}

        <Skeleton className="h-8 w-20 self-end" />
      </CardContent>
    </>
  )
}

type ErrorProps = {
  message: string
}

function SplitBillError({ message }: ErrorProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-1 text-red-500">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <span className="h-5">分摊账单出错</span>
      </CardTitle>
      <CardDescription>{message}</CardDescription>
    </CardHeader>
  )
}

function useWatchFriendExpense(form: UseFormReturn<FormSchema>) {
  const watchedBill = form.watch('bill')
  const watchedUserExpense = form.watch('userExpense')

  React.useEffect(() => {
    // 虽然通过 `Zod` 的验证最终从 `handleSubmit` 得到的是 `number`
    // 但在这里的值仍然是 `string`，所以需要转换
    const bill = Number(watchedBill)
    const userExpense = Number(watchedUserExpense)

    if (userExpense > bill) return

    form.setValue('friendExpense', Number((bill - userExpense).toFixed(2)))
  }, [watchedBill, watchedUserExpense, form])
}

// 为测试验证, 添加一个不在 options 中的值
function getWhoIsPayingOptions(friend: string) {
  const options = whoIsPayingOptions.map(({ value, label }) => ({
    value,
    label: value === 'friend' ? friend : label
  }))

  // 添加一个额外选项，用于测试表单验证
  options.push({ value: 'anonymous', label: '匿名' })
  return options
}

export { SplitBill }
