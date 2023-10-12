import { ApiResponse } from '@/lib/use-fetch'
import { wait } from '@/lib/utils'
import { sendRequest } from '@/lib/http'

type LoginParams = {
  username: string
  password: string
  signal?: AbortSignal
}

type Token = {
  accessToken: string
}

async function getAccessTokenApi(
  params: LoginParams
): Promise<ApiResponse<Token>> {
  await wait(2)

  if (params.username !== 'admin' || params.password !== 'admin') {
    return { data: null, error: 'Invalid username or password' }
  }

  const { data, error } = await sendRequest<Token, string>({
    url: 'http://localhost:5173/data/token.json'
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: '' }
}

export { getAccessTokenApi, type Token }
