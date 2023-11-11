import { type ApiResponse, type FetchPayload } from '@/hooks/use-fetch'
import { wait } from '@/utils/helpers'
import { sendRequest } from '@/utils/http'

const BASE_URL = window.location.host

type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
  birthday: string
}

async function getFriendsApi(
  payload: FetchPayload
): Promise<ApiResponse<Friend[]>> {
  await wait(0.5) // simulate network delay

  const { data, error } = await sendRequest<Friend[], string>({
    url: `http://${BASE_URL}/data/friends.json`,
    signal: payload.signal
  })

  if (error) return { data: null, error }

  return { data, error: '' }
}

export { getFriendsApi, type Friend }
