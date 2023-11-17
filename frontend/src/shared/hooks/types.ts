// ----- Fetch 相关数据类型 -----
export type ReLogin = { isOk: true; auth: Auth } | { isOk: false }

export type FetchResponse<T> = {
  data: T | null
  error: string
  reLogin?: ReLogin
}

export type Auth = {
  accessToken: string
  refreshToken: string
  nickname: string
  authorities: string[]
}

export type FetchPayload = {
  signal: AbortSignal
  auth: Auth | null
}

export type AbortFetch = () => void
