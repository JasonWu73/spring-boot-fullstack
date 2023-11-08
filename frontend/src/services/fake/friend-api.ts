import {type ApiResponse, type FetchPayload} from '@/hooks/use-fetch'
import {sendRequest} from '@/utils/http'
import {wait} from '@/utils/helpers'

type FriendResponse = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
  birthday: string
}

async function getFriendsApi(
  payload: FetchPayload
): Promise<ApiResponse<FriendResponse[]>> {
  await wait(0.5)

  const {data, error} = await sendRequest<FriendResponse[], string>({
    url: 'http://localhost:5173/data/friends.json',
    signal: payload.signal
  })

  if (error) {
    return {data: null, error}
  }

  return {data, error: ''}
}

export {getFriendsApi, type FriendResponse}
