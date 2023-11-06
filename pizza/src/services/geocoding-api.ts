import { type ApiResponse, type FetchPayload } from '@/hooks/use-fetch'
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

async function getAddress(
  payload: FetchPayload,
  { latitude, longitude }: GetAddressParams
): Promise<ApiResponse<GeocodeResponse>> {
  const { data, error } = await sendRequest<GeocodeResponse, ErrorResponse>({
    url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
    signal: payload.signal
  })

  if (!error) {
    return { data, error: '' }
  }

  if (typeof error === 'string') {
    return { data: null, error }
  }

  return { data: null, error: error.description }
}

export { getAddress }
