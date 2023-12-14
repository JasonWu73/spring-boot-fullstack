import { requestApi } from '@/shared/apis/backend/helpers'

type Version = {
  name: string
  version: string
  developer: string
  builtAt: string
}

/**
 * 获取版本信息。
 *
 * @returns Promise<Version> 版本信息
 */
export async function getVersion() {
  const { data, error } = await requestApi<Version>({
    url: '/api/v1/public/version'
  })

  if (error) {
    throw new Error(error)
  }

  return data!
}
