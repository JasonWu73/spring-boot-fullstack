import { type FetchPayload } from '@/hooks/use-fetch'
import { sendRequest } from '@/utils/http'

const API_URL = 'https://rreact-fast-pizza-api.onrender.com/api'

type Menu = {
  id: number
  name: string
  unitPrice: number
  imageUrl: string
  ingredients: string[]
  soldOut: boolean
}

type MenuResponse = {
  status: string
  data: Menu[]
}

type ErrorResponse = {
  status: number
  message: string
}

async function getMenuApi(payload: FetchPayload) {
  const { data, error } = await sendRequest<MenuResponse, ErrorResponse>({
    url: `${API_URL}/menu`,
    signal: payload.signal
  })

  if (!error) {
    return { data: data?.data ?? [], error: '' }
  }

  generateError(error)
}

type OrderResponse = {
  id: number
}

async function getOrderApi(payload: FetchPayload, id: number) {
  const { data, error } = await sendRequest<OrderResponse, ErrorResponse>({
    url: `${API_URL}/order/${id}`,
    signal: payload.signal
  })

  if (!error) {
    return { data, error: '' }
  }

  generateError(error)
}

async function createOrderApi(payload: FetchPayload, newOrder: OrderResponse) {
  const { data, error } = await sendRequest<OrderResponse, ErrorResponse>({
    url: `${API_URL}/order`,
    method: 'POST',
    signal: payload.signal,
    bodyData: newOrder
  })

  if (!error) {
    return { data, error: '' }
  }

  generateError(error)
}

type UpdateOrder = {
  id: number
  updateObj: OrderResponse
}

async function updateOrderApi(
  payload: FetchPayload,
  { id, updateObj }: UpdateOrder
) {
  const { data, error } = await sendRequest<void, ErrorResponse>({
    url: `${API_URL}/order/${id}`,
    method: 'PATCH',
    signal: payload.signal,
    bodyData: updateObj
  })

  if (!error) {
    return { data, error: '' }
  }

  generateError(error)
}

function generateError(error: string | ErrorResponse) {
  if (typeof error === 'string') {
    throw new Error(error)
  }

  throw new Error(error.message)
}

export { getMenuApi, getOrderApi, createOrderApi, updateOrderApi, type Menu }
