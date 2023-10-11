import { ApiResponse } from '@/lib/use-fetch'
import { wait } from '@/lib/utils'
import { sendRequest } from '@/lib/http'

type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
}

async function getFriends(): Promise<ApiResponse<Friend[]>> {
  await wait(2)

  const { data, error } = await sendRequest<Friend[], string>({
    url: 'http://localhost:5173/data/friends.json'
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: '' }
}
export { getFriends, type Friend }
