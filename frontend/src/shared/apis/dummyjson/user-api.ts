import type { ApiError, PaginationData, User } from '@/shared/apis/dummyjson/types'
import type { FetchPayload, FetchResponse } from '@/shared/hooks/types'
import { sendRequest } from '@/shared/utils/http'

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

  const { data, error } = await sendRequest<PaginationData<User>, ApiError>({
    url: 'https://dummyjson.com/users/search?select=id,firstName,lastName,email,username,password,birthDate,image',
    signal: payload.signal,
    urlData: {
      limit: pageSize,
      skip: (pageNum - 1) * pageSize,
      q: query
    }
  })

  if (error) {
    if (typeof error === 'string') return { data: null, error }

    return { data: null, error: error.message }
  }

  return { data, error: '' }
}

export { getUsersApi }
