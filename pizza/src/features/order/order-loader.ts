import { getOrderApi } from '@/services/restaurant-api'
import { type LoaderFunctionArgs } from 'react-router-dom'

async function orderLoader({ params }: LoaderFunctionArgs) {
  return await getOrderApi(
    { signal: new AbortController().signal },
    params.orderId!
  )
}

export { orderLoader }
