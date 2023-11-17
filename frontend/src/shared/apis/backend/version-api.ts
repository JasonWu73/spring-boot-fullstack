import { requestApi } from '@/shared/apis/backend/auth-api'
import type { Version } from '@/shared/apis/backend/types'

type Params = {
  abortSignal?: AbortSignal
}

async function getVersionApi(params?: Params) {
  return await requestApi<Version>({
    url: '/api/v1/version',
    signal: params?.abortSignal
  })
}

export { getVersionApi }
