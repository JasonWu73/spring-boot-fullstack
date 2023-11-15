import { sendAuthDummyJsonApi } from '@/shared/apis/dummyjson/auth-api'
import { type ApiResponse, type FetchPayload } from '@/shared/hooks/use-fetch'
import type { PaginationData, User } from './types'

type GetUsersParams = {
  pageNum: number
  pageSize: number
  query: string
}

async function getUsersApi(
  payload: FetchPayload,
  params?: GetUsersParams
): Promise<ApiResponse<PaginationData<User>>> {
  if (!params) return { data: null, error: '未传入参数' }

  const { pageNum, pageSize, query } = params

  return await sendAuthDummyJsonApi<PaginationData<User>>({
    payload,
    url: 'users/search?select=id,firstName,lastName,email,username,password,birthDate,image',
    urlData: {
      limit: pageSize,
      skip: (pageNum - 1) * pageSize,
      q: query
    }
  })
}

export { getUsersApi }
