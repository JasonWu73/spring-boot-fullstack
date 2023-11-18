import type { Friend } from '@/shared/apis/fake/types'
import { wait } from '@/shared/utils/helpers'
import { sendRequest } from '@/shared/utils/http'

const BASE_URL = window.location.host

async function getFriendsApi() {
  await wait(0.5) // Simulate network delay

  const { data, error } = await sendRequest<Friend[], string>({
    url: `http://${BASE_URL}/data/friends.json`
  })

  if (error) return { data: null, error }

  return { data, error: '' }
}

export { getFriendsApi }
