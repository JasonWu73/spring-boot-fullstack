import { type ApiResponse } from '@/hooks/use-fetch'
import { sendRequest } from '@/lib/http'
import { wait } from '@/lib/utils'

type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
}

async function getFriendsApi(
  signal?: AbortSignal
): Promise<ApiResponse<Friend[]>> {
  await wait(0.5)

  const { data, error } = await sendRequest<Friend[], string>({
    url: 'http://localhost:5173/data/friends.json',
    signal
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: '' }
}

export { getFriendsApi, type Friend }
