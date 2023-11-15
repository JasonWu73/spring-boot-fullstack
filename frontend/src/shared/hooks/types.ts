// ----- 开始：Fetch 相关数据类型 -----
export type ReLogin = { isOk: true; token: string } | { isOk: false }

export type ApiResponse<T> = {
  data: T | null
  error: string
  reLogin?: ReLogin
}

export type Auth = {
  id: number
  username: string
  password: string
  token: string
  nickname: string
}

export type FetchPayload = {
  signal: AbortSignal
  auth: Auth | null
}

export type AbortCallback = () => void
// ----- 结束：Fetch 相关数据类型 -----
