import { ApiResponse } from '@/lib/use-fetch'
import { wait } from '@/lib/utils'

type LoginParams = {
  username: string
  password: string
  signal?: AbortSignal
}

type Token = {
  accessToken: string
}

async function getAccessToken(data: LoginParams): Promise<ApiResponse<Token>> {
  await wait(2)

  if (data.username !== 'admin' || data.password !== 'admin') {
    return { data: null, error: 'Invalid username or password' }
  }

  return { data: { accessToken: 'fake-token-123' }, error: '' }
}

export { getAccessToken, type Token }
