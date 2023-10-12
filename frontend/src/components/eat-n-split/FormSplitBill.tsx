import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'

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
import { Skeleton } from '@/components/ui/Skeleton'
import { StarRating } from '@/components/ui/StarRating'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/Tooltip'
import { useTitle } from '@/lib/use-title'
import { useFetch } from '@/lib/use-fetch'
import { useLocalStorageState } from '@/lib/use-storage'
import {
  type Friend,
  getFriendApi,
  updateFriendApi
} from '@/api/fake/friend-api'

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

function FormSplitBill() {
  useTitle('Split bill')

  const params = useParams()
  const friendId = Number(params.friendId)

  const [friends, setFriends] = useLocalStorageState<Friend[]>('friends', [])

  const { data, error, loading, fetchData } = useFetch<Friend, number>(
    async (id, signal) => {
      const idToFetch = id ?? friendId

      const { data, error } = await getFriendApi(idToFetch, signal)

      if (error) {
        return { data: null, error }
      }

      if (friends.length !== 0) {
        const friend = friends.find((friend) => friend.id === idToFetch)

        if (!friend) {
          return { data: null, error: 'Friend not found' }
        }

        return { data: friend, error: '' }
      }

      return { data, error }
    }
  )

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

  useRefreshFriend(friendId, fetchData, form.reset)

  function handleCreditRating(creditRating: number) {
    setFriends((prev) =>
      prev.map((prev) => {
        if (prev.id === friendId) {
          return {
            ...prev,
            creditRating
          }
        }

        return prev
      })
    )
  }

  const navigate = useNavigate()

  const {
    error: splitError,
    loading: splitLoading,
    fetchData: updateFriend
  } = useFetch<null, Friend>(async (friend, signal) => {
    const { error } = await updateFriendApi(friend!, signal)

    if (error) {
      return { data: null, error }
    }

    if (friends.length !== 0) {
      const selectedFriend = friends.find(({ id }) => id === friend?.id)

      if (!selectedFriend) {
        return { data: null, error: 'Friend not found' }
      }

      return { data: null, error: '' }
    }

    return { data: null, error }
  }, false)

  async function splitBill(bill: Bill) {
    setFriends((prev) =>
      prev.map((prev) => {
        if (prev.id === bill.friendId) {
          return {
            ...prev,
            balance: Number((prev.balance - bill.expense).toFixed(2))
          }
        }

        return prev
      })
    )

    const newFriend = friends.find((friend) => friend.id === bill.friendId)
    await updateFriend(newFriend)
    navigate('/eat-split?c=1')
  }

  async function onSubmit(values: FormSchema) {
    const bill = {
      friendId: friendId,
      expense:
        values.whoIsPaying === 'user'
          ? -values.friendExpense
          : values.userExpense
    }

    await splitBill(bill)

    form.reset()
  }

  return (
    <Card className="w-96 bg-amber-100 text-slate-700 dark:bg-amber-100 dark:text-slate-700 md:w-[22rem] lg:w-[30rem]">
      {loading && <SkeletonForm />}

      {!loading && error && <Error message={error} />}

      {!loading && data && (
        <>
          <CardHeader>
            <CardTitle>Split bill, my friend</CardTitle>

            <CardDescription className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
              Split a bill with{' '}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-semibold text-cyan-500">
                      {data.name}
                    </span>
                  </TooltipTrigger>

                  <TooltipContent>{data.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardDescription>

            <StarRating
              defaultRating={data.creditRating}
              onRate={(rating) => handleCreditRating(rating)}
              size="lg"
            />

            {splitError && (
              <p className="text-red-500 dark:text-red-600">{splitError}</p>
            )}
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
                  label={`👫 ${data.name}'s expense`}
                  labelWidth={160}
                  placeholder={`${data.name}'s expense`}
                  disabled
                />

                <FormSelect
                  control={form.control}
                  name="whoIsPaying"
                  label="🤑 Who is paying the bill"
                  labelWidth={160}
                  options={getSelections(data.name)}
                  isError={form.getFieldState('whoIsPaying')?.invalid}
                />

                <Button
                  disabled={splitLoading}
                  type="submit"
                  className="self-end"
                >
                  {splitLoading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Split bill
                </Button>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  )
}

function SkeletonForm() {
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
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-full" />
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

function Error({ message }: ErrorProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-1 text-red-500">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <span className="h-5">Oops, something went wrong</span>
      </CardTitle>
      <CardDescription>{message}</CardDescription>
    </CardHeader>
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

function useRefreshFriend(
  friendId: number,
  fetchData: (id: number) => void,
  resetForm: () => void
) {
  useEffect(() => {
    resetForm()

    fetchData(friendId)
  }, [friendId, fetchData, resetForm])
}

export { type Bill, FormSplitBill }
