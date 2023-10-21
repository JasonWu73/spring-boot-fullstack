import type { ApiResponse, FetchPayload } from '@/hooks/use-fetch'
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
  { pageNum, pageSize, query }: GetUsersParams,
  payload: FetchPayload
): Promise<ApiResponse<UserPagination>> {
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
