import type { Friend } from '@/shared/apis/fake/types'
import { wait } from '@/shared/utils/helpers'
import { sendRequest } from '@/shared/utils/http'

const BASE_URL = window.location.host

async function getFriendsApi() {
  await wait(0.5) // Simulate network delay

  const { status, data, error } = await sendRequest<Friend[], string>({
    url: `http://${BASE_URL}/data/friends.json`
  })

  if (error) return { status, data: null, error }

  return { status, data, error: '' }
}

export { getFriendsApi }
