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

async function createOrder({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

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

export { orderLoader, createOrder }
