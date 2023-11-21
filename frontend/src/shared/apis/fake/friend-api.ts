import { wait } from '@/shared/utils/helpers'
import { sendRequest } from '@/shared/utils/http'

type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
  birthday: string
}

const BASE_URL = window.location.host

async function getFriendsApi() {
  await wait(0.5) // Simulate network delay

  const { status, data, error } = await sendRequest<Friend[], string>({
    url: `http://${BASE_URL}/data/friends.json`
  })

  if (error) return { status, data: null, error }

  return { status, data, error: '' }
}

export { getFriendsApi, type Friend }
