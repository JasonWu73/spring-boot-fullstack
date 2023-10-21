import { type ApiResponse, type FetchPayload } from '@/hooks/use-fetch'
import { sendAuthDummyJsonApi } from '@/api/dummyjson/auth'

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  birthDate: string
  image: string
}

type UserPagination = {
  users: User[]
  total: number
  skip: number
  limit: number
}

type GetUsersParams = {
  pageNum: number
  pageSize: number
  query: string
}

async function getUsersApi(
  payload: FetchPayload,
  params?: GetUsersParams
): Promise<ApiResponse<UserPagination>> {
  if (!params) {
    return { data: null, error: '未传入参数' }
  }

  const { pageNum, pageSize, query } = params

  return await sendAuthDummyJsonApi<UserPagination>({
    payload,
    url: `users/search?select=id,firstName,lastName,email,username,password,birthDate,image`,
    urlData: {
      limit: pageSize,
      skip: (pageNum - 1) * pageSize,
      q: query
    }
  })
}

export { getUsersApi }
