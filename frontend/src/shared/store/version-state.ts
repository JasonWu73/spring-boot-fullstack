import { signal } from '@preact/signals-react'

import { requestApi } from '@/shared/store/auth-state'

type Version = {
  name: string
  version: string
  developer: string
  builtAt: string
}

/**
 * 版本号。
 */
export const version = signal<Version | undefined>(undefined)

// 上次请求的时间戳，用于防止短时间内多次请求
let requestedAt = 0

/**
 * 创建版本号数据 Signal。
 */
export async function createVersionState() {
  if (version.value !== undefined) return

  // 500 毫秒内多次请求，只处理第一次请求
  if (Date.now() - requestedAt < 500) return

  requestedAt = Date.now()

  const { data } = await requestApi<Version>({
    url: '/api/v1/public/version'
  })

  if (data) {
    version.value = data
  }
}
