// ----- 接口通用数据类型 -----
// 错误响应数据类型
export type ApiError = {
  timestamp: string
  status: number
  error: string
  path: string
}

// ----- 登录相关数据类型 -----
export type LoginParams = {
  username: string
  password: string
  abortSignal?: AbortSignal
}

export type Auth = {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  nickname: string
  authorities: string[]
}

// ----- 项目版本号相关数据类型 -----
export type Version = {
  name: string
  version: string
  developer: string
  builtAt: string
}
