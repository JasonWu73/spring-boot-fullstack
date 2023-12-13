import { signal } from '@preact/signals-react'

import { requestApi } from '@/shared/signals/auth'

type Version = {
  name: string
  version: string
  developer: string
  builtAt: string
}

/**
 * 版本号 Signal。
 * <p>
 * 不要直接导出 Signal，而是应该导出方法来使用 Signal。
 */
const version = signal<Version | undefined>(undefined)

/**
 * 创建版本号数据 Signal。
 * <p>
 * 仅可在应用启动时初始化一次。
 */
export async function createVersionState() {
  if (version.value !== undefined) return

  const { data } = await requestApi<Version>(
    {
      url: '/api/v1/public/version'
    },
    true
  )

  if (data) {
    version.value = data
  }
}

/**
 * 获取版本号信息。
 *
 * @returns Version 版本号信息
 */
export function getVersion() {
  return version.value
}
