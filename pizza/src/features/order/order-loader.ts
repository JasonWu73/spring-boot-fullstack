import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect
} from 'react-router-dom'

import {
  createOrderApi,
  getOrderApi,
  type NewOrder
} from '@/services/restaurant-api'

async function orderLoader({ params }: LoaderFunctionArgs) {
  return await getOrderApi(
    { signal: new AbortController().signal },
    params.orderId!
  )
}

async function createOrderAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const error: Record<string, string> = {}

  if (!isValidPhone(data.phone as string)) {
    error.phone = 'Invalid phone number'
  }

  if (Object.keys(error).length > 0) {
    return error
  }

  const newOrder = {
    ...data,
    priority: data.priority === 'on',
    cart: JSON.parse(data.cart as string)
  } as NewOrder

  const response = await createOrderApi(
    { signal: new AbortController().signal },
    newOrder
  )

  return redirect(`/order/${response!.data!.id}`)
}

function isValidPhone(phone: string) {
  return /^\d+$/.test(phone)
}

export { orderLoader, createOrderAction }
