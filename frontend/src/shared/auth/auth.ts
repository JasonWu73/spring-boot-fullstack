import { computed, effect, signal } from '@preact/signals-react'

import type { AuthResponse } from '@/shared/apis/backend/auth'

/**
 * 用户名和密码的加密公钥。
 */
export const PUBLIC_KEY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbGWjwR4QAjBiJwMi5QNe+X8oPEFBfX3z5K6dSv9tU2kF9SVkf8uGGJwXeihQQ0o9aUk42zO58VL3MqDOaWHU6wm52pN9ZBbH0XJefqxtgyXrYAm279MU6EY4sywkUT9KOOgk/qDHB93IoEDL1fosYc7TRsAONuMGiyTJojn1FCPtJbbj7J56yCaFhUpuDunBFETQ32usRaK4KCWx9w0HZ6WmbX8QdcJkVjJ2FCLuGkvbKmUQ5h/GXXnNgbxIn3z2lX7snGRMhIFvW0Qjkn8YmOq6HUj7TU0jKm9VhZirVQXh8trvi2ivY7s6yJoF8N72Ekn94WSpSRVeC0XpXf2LQIDAQAB'

const STORAGE_KEY = 'demo-auth'

/**
 * 前端存储的身份验证数据类型。
 */
type Auth = {
  accessToken: string
  refreshToken: string
  nickname: string
  authorities: string[]
  expiresAt: number
}

// 上下级权限关系为：root > admin > user
// 超级管理员权限，前端不可手动分配

export const ROOT = { value: 'root', label: '超级管理员' }
export const ADMIN = { value: 'admin', label: '管理员' }
export const USER = { value: 'user', label: '用户' }

/**
 * 前端存储的身份验证数据 Signal。
 * <p>
 * 不要直接导出 Signal，而是应该导出方法来使用 Signal。
 */
const auth = signal<Auth | null>(undefined as unknown as Auth)

/**
 * 是否拥有超级管理员权限 Signal。
 * <p>
 * 不要直接导出 Signal，而是应该导出方法来使用 Signal。
 */
const isRoot = computed(() => auth.value?.authorities.includes(ROOT.value))

/**
 * 是否拥有管理员权限 Signal。
 * <p>
 * 不要直接导出 Signal，而是应该导出方法来使用 Signal。
 */
const isAdmin = computed(
  () => isRoot.value || (auth.value?.authorities.includes(ADMIN.value) ?? false)
)

/**
 * 是否拥有普通用户权限 Signal。
 * <p>
 * 不要直接导出 Signal，而是应该导出方法来使用 Signal。
 */
const isUser = computed(
  () => isAdmin.value || (auth.value?.authorities.includes(USER.value) ?? false)
)

/**
 * 创建本地缓存的身份验证数据 Signal。
 * <p>
 * 仅可在应用启动时初始化一次。
 */
export function createAuthState() {
  if (auth.value !== undefined) return

  auth.value = getStorageAuth()

  // 监听身份验证数据的变化，将其存储到本地存储中
  effect(() => {
    setStorageAuth(auth.value)
  })
}

/**
 * 获取前端缓存的身份验证数据，即登录信息。
 *
 * @returns string 身份验证数据
 */
export function getAuth() {
  return auth.value
}

/**
 * 是否拥有超级管理员权限。
 *
 * @returns boolean 是否拥有超级管理员权限
 */
export function hasRoot() {
  return isRoot.value
}

/**
 * 是否拥有管理员权限。
 *
 * @returns boolean 是否拥有管理员权限
 */
export function hasAdmin() {
  return isAdmin.value
}

/**
 * 是否拥有普通用户权限。
 *
 * @returns boolean 是否拥有普通用户权限
 */
export function hasUser() {
  return isUser.value
}

/**
 * 获取当前登录用户的昵称。
 *
 * @param nickname 新的昵称
 */
export function updateNickname(nickname: string) {
  if (!auth.value) return

  auth.value = { ...auth.value, nickname }
}

/**
 * 设置前端缓存的身份验证数据。
 *
 * @param data 后端返回的身份验证数据
 */
export function setAuth(data: AuthResponse) {
  auth.value = toStorageAuth(data)
}

/**
 * 清除前端缓存的身份验证数据，即退出登录。
 */
export function clearAuth() {
  auth.value = null
}

function getStorageAuth(): Auth | null {
  const storageAuth = localStorage.getItem(STORAGE_KEY)

  if (!storageAuth) return null

  return JSON.parse(storageAuth)
}

function setStorageAuth(auth: Auth | null) {
  if (!auth) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

function toStorageAuth(data: AuthResponse): Auth {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    nickname: data.nickname,
    authorities: data.authorities,
    expiresAt: Date.now() + data.expiresInSeconds * 1000
  }
}
