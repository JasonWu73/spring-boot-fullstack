import { type ApiResponse, type FetchPayload } from '@/shared/hooks/use-fetch'
import { wait } from '@/shared/utils/helpers'
import { sendRequest } from '@/shared/utils/http'

const BASE_URL = window.location.host

type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
  birthday: string
}

async function getFriendsApi(payload: FetchPayload): Promise<ApiResponse<Friend[]>> {
  await wait(0.5) // Simulate network delay

  const { data, error } = await sendRequest<Friend[], string>({
    url: `http://${BASE_URL}/data/friends.json`,
    signal: payload.signal
  })

  if (error) return { data: null, error }

  return { data, error: '' }
}

export { getFriendsApi, type Friend }
