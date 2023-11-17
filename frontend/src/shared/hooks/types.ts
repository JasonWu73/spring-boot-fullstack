// ----- Fetch 相关数据类型 -----
export type ReLogin = { success: true; auth: Auth } | { success: false }

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
