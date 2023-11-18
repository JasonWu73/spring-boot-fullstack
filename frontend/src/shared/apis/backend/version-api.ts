import { requestApi } from '@/shared/apis/backend/auth-api'
import type { Version } from '@/shared/apis/backend/types'

async function getVersionApi() {
  return await requestApi<Version>({
    url: '/api/v1/version'
  })
}

export { getVersionApi }
