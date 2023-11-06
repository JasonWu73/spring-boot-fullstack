import { type ApiResponse, type FetchPayload } from '@/hooks/use-fetch'
import { sendRequest } from '@/utils/http'

type Params = {
  latitude: number
  longitude: number
}

type Geocode = {
  countryName: string
  city: string
}

type ApiError = {
  status: number
  description: string
}

async function getAddress(
  payload: FetchPayload,
  { latitude, longitude }: Params
): Promise<ApiResponse<Geocode>> {
  const { data, error } = await sendRequest<Geocode, ApiError>({
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
