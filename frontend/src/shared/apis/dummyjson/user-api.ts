import { sendAuthDummyJsonApi } from '@/shared/apis/dummyjson/auth-api'
import type { PaginationData, User } from '@/shared/apis/dummyjson/types'
import type { FetchPayload, FetchResponse } from '@/shared/hooks/types'

type GetUsersParams = {
  pageNum: number
  pageSize: number
  query: string
}

async function getUsersApi(
  payload: FetchPayload,
  params?: GetUsersParams
): Promise<FetchResponse<PaginationData<User>>> {
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
