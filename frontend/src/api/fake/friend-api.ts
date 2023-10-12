import { ApiResponse } from '@/lib/use-fetch'
import { sendRequest } from '@/lib/http'
import { wait } from '@/lib/utils'

type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
}

async function getFriends(
  signal?: AbortSignal
): Promise<ApiResponse<Friend[]>> {
  await wait(2)

  const { data, error } = await sendRequest<Friend[], string>({
    url: 'http://localhost:5173/data/friends.json',
    signal
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: '' }
}

async function getFriend(
  id: number,
  signal?: AbortSignal
): Promise<ApiResponse<Friend>> {
  const { data, error } = await getFriends(signal)

  if (error) {
    return { data: null, error }
  }

  const friend = data?.find((friend) => friend.id === id)

  if (friend) {
    return { data: friend, error: '' }
  }

  return { data: null, error: 'Friend not found' }
}

export { type Friend, getFriend, getFriends }
