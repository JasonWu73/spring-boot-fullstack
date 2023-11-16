import { BASE_URL } from '@/shared/apis/backend/constants'
import type { ApiError, Version } from '@/shared/apis/backend/types'
import type { FetchPayload } from '@/shared/hooks/types'
import { sendRequest } from '@/shared/utils/http'

async function getVersionApi(payload: FetchPayload) {
  const { data, error } = await sendRequest<Version, ApiError>({
    url: `${BASE_URL}/api/v1/version`,
    signal: payload.signal
  })

  if (error) {
    if (typeof error === 'string') return { data: null, error }

    return { data: null, error: error.error }
  }

  return { data, error: '' }
}

export { getVersionApi }
