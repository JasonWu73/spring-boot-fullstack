import { requestApi } from '@/shared/apis/backend/helpers'
import type { PaginationData, PaginationParams } from '@/shared/apis/types'
import { PUBLIC_KEY } from '@/shared/auth/auth'
import { encrypt } from '@/shared/utils/rsa'

export type GetUsersParams = PaginationParams & {
  username?: string
  nickname?: string
  status?: string
  authority?: string
}

export type User = {
  id: number
  createdAt: string
  updatedAt: string
  remark: string
  username: string
  nickname: string
  status: number
  authorities: string[]
}

/**
 * 获取用户分页数据。
 *
 * @param params 分页查询条件
 * @returns Promise 响应结果
 */
export async function getUsersApi(params: GetUsersParams) {
  return await requestApi<PaginationData<User>>({
    url: '/api/v1/users',
    urlParams: params
  })
}

type AddUserParams = {
  username: string
  nickname: string
  password: string
  authorities: string[]
  remark: string
}

/**
 * 获取用户详情。
 *
 * @param userId 需要获取详情的用户 ID
 * @returns Promise 响应结果
 */
export async function getUserApi(userId: number) {
  return await requestApi<User>({ url: `/api/v1/users/${userId}` })
}

/**
 * 添加用户。
 *
 * @param username 用户名
 * @param nickname 昵称
 * @param password 密码
 * @param authorities 权限
 * @param remark 备注
 */
export async function addUserApi({
  username,
  nickname,
  password,
  authorities,
  remark
}: AddUserParams) {
  return await requestApi<void>({
    url: '/api/v1/users',
    method: 'POST',
    bodyData: {
      username,
      nickname,
      password: encrypt(PUBLIC_KEY, password),
      authorities,
      remark
    }
  })
}

type UpdateUserParams = {
  userId: number
  nickname: string
  authorities: string[]
  remark: string
}

/**
 * 更新用户。
 *
 * @param userId 需要更新的用户 ID
 * @param nickname 昵称
 * @param authorities 权限
 * @param remark 备注
 */
export async function updateUserApi({
  userId,
  nickname,
  authorities,
  remark
}: UpdateUserParams) {
  return await requestApi<void>({
    url: `/api/v1/users/${userId}`,
    method: 'PUT',
    bodyData: { nickname, authorities, remark }
  })
}

export type AccountStatus = 0 | 1

/**
 * 更新用户状态。
 *
 * @param userId 需要更新状态的用户 ID
 * @param status 新的账号状态
 * @returns Promise 响应结果
 */
export async function updateUserStatusApi(userId: number, status: AccountStatus) {
  return await requestApi<void>({
    url: `/api/v1/users/${userId}/status`,
    method: 'PUT',
    bodyData: { status }
  })
}

/**
 * 删除用户。
 *
 * @param userId 需要删除的用户 ID
 * @returns Promise 响应结果
 */
export async function deleteUserApi(userId: number) {
  return await requestApi<void>({
    url: `/api/v1/users/${userId}`,
    method: 'DELETE'
  })
}

/**
 * 获取当前登录用户信息。
 *
 * @returns Promise 响应结果
 */
export async function getMeApi() {
  return await requestApi<User>({
    url: '/api/v1/users/me'
  })
}

type UpdateMe = {
  nickname: string
  oldPassword?: string
  newPassword?: string
}

/**
 * 更新当前登录用户信息。
 *
 * @param nickname 新的昵称
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export async function updateMeApi({ nickname, oldPassword, newPassword }: UpdateMe) {
  return await requestApi<void>({
    url: '/api/v1/users/me',
    method: 'PUT',
    bodyData: {
      nickname,
      oldPassword: oldPassword ? encrypt(PUBLIC_KEY, oldPassword) : null,
      newPassword: newPassword ? encrypt(PUBLIC_KEY, newPassword) : null
    }
  })
}
