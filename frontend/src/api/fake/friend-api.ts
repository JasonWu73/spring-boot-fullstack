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

async function getFriendsApi(
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

async function getFriendApi(
  id: number,
  signal?: AbortSignal
): Promise<ApiResponse<Friend>> {
  const { data, error } = await getFriendsApi(signal)

  if (error) {
    return { data: null, error }
  }

  const friend = data?.find((friend) => friend.id === id)

  if (friend) {
    return { data: friend, error: '' }
  }

  return { data: null, error: 'Friend not found' }
}

async function addFriendApi(
  friend: Friend,
  signal?: AbortSignal
): Promise<ApiResponse<Friend>> {
  const { error } = await getFriendsApi(signal)

  if (error) {
    return { data: null, error }
  }

  if (!friend) {
    return { data: null, error: 'New friend data must be exits' }
  }

  return { data: null, error: '' }
}

export { type Friend, getFriendApi, getFriendsApi, addFriendApi }
