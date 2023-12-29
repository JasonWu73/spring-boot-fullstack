import { requestApi } from '@/shared/apis/backend/helpers'
import { PUBLIC_KEY } from '@/shared/auth/auth-signals'
import { encrypt } from '@/shared/utils/rsa'

/**
 * 后端返回的身份验证数据类型。
 */
export type AuthResponse = {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  nickname: string
  authorities: string[]
}

/**
 * 登录。
 *
 * @param username 用户名
 * @param password 密码
 * @returns Promise 响应结果
 */
export async function loginApi(username: string, password: string) {
  return await requestApi<AuthResponse>({
    url: '/api/v1/auth/login',
    method: 'POST',
    bodyData: {
      username: encrypt(PUBLIC_KEY, username),
      password: encrypt(PUBLIC_KEY, password)
    }
  })
}

/**
 * 退出登录。
 *
 * @returns Promise 响应结果
 */
export async function logoutApi() {
  return await requestApi<void>({
    url: '/api/v1/auth/logout',
    method: 'DELETE'
  })
}

export async function getLoggedInUsersApi() {
  return await requestApi<string[]>({
    url: '/api/v1/auth/logged-in-users'
  })
}
