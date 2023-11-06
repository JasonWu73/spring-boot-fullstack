import { type FetchPayload } from '@/hooks/use-fetch'
import { sendRequest } from '@/lib/http'
import { wait } from '@/lib/utils'

type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
  birthday: string
}

async function getFriendsApi(payload: FetchPayload) {
  await wait(0.5)

  const { data, error } = await sendRequest<Friend[], string>({
    url: 'http://localhost:5173/data/friends.json',
    signal: payload.signal
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: '' }
}

export { getFriendsApi, type Friend }
