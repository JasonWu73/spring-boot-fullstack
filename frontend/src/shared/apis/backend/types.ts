// ----- 接口通用数据类型 -----
// 错误响应数据类型
export type ApiError = {
  timestamp: string
  status: number
  error: string
  path: string
}

// ----- 项目版本号相关数据类型 -----
export type Version = {
  name: string
  version: string
  developer: string
  builtAt: string
}
