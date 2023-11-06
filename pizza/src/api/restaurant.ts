import { type ApiResponse, type FetchPayload } from '@/hooks/use-fetch'
import { sendRequest } from '@/lib/http'

const API_URL = 'https://react-fast-pizza-api.onrender.com/api'

type MenuItem = {
  id: number
  name: string
  unitPrice: number
  imageUrl: string
  ingredients: string[]
  soldOut: boolean
}

type Menu = {
  status: string
  data: MenuItem[]
}

type ApiError = {
  status: number
  message: string
}

async function getMenu(payload: FetchPayload): Promise<ApiResponse<Menu>> {
  const { data, error } = await sendRequest<Menu, ApiError>({
    url: `${API_URL}/menu`,
    signal: payload.signal
  })

  if (!error) {
    return { data, error: '' }
  }

  return generateError(error)
}

type Order = {
  id: number
}

async function getOrder(payload: FetchPayload, id: number) {
  const { data, error } = await sendRequest<Order, ApiError>({
    url: `${API_URL}/order/${id}`,
    signal: payload.signal
  })

  if (!error) {
    return { data, error: '' }
  }

  return generateError(error)
}

async function createOrder(payload: FetchPayload, newOrder: Order) {
  const { data, error } = await sendRequest<Order, ApiError>({
    url: `${API_URL}/order`,
    method: 'POST',
    signal: payload.signal,
    bodyData: newOrder
  })

  if (!error) {
    return { data, error: '' }
  }

  return generateError(error)
}

type UpdateOrder = {
  id: number
  updateObj: Order
}

async function updateOrder(
  payload: FetchPayload,
  { id, updateObj }: UpdateOrder
) {
  const { data, error } = await sendRequest<void, ApiError>({
    url: `${API_URL}/order/${id}`,
    method: 'PATCH',
    signal: payload.signal,
    bodyData: updateObj
  })

  if (!error) {
    return { data, error: '' }
  }

  return generateError(error)
}

function generateError(error: string | ApiError) {
  if (typeof error === 'string') {
    return { data: null, error }
  }

  return { data: null, error: error.message }
}

export { getMenu, getOrder, createOrder, updateOrder }
