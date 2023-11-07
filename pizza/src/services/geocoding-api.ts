import { type FetchPayload } from '@/hooks/use-fetch'
import { sendRequest } from '@/utils/http'

type GetAddressParams = {
  latitude: number
  longitude: number
}

type GeocodeResponse = {
  countryName: string
  city: string
}

type ErrorResponse = {
  status: number
  description: string
}

async function getAddressApi(
  payload: FetchPayload,
  { latitude, longitude }: GetAddressParams
) {
  const { data, error } = await sendRequest<GeocodeResponse, ErrorResponse>({
    url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
    signal: payload.signal
  })

  if (!error) {
    return { data, error: '' }
  }

  if (typeof error === 'string') {
    throw new Error(error)
  }

  throw new Error(error.description)
}

export { getAddressApi }
