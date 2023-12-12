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
 */
export const version = signal<Version | undefined>(undefined)

/**
 * 因为版本号是从后端获取的（异步的），所以需要一个额外变量来标记是否已经初始化过了，而不能简单地通过 `version.value !== undefined` 来判断，虽然 Signal 的更新是同步的。
 */
let initials = true

/**
 * 创建版本号数据 Signal。
 * <p>
 * 仅可在应用启动时初始化一次。
 */
export async function createVersionState() {
  if (version.value !== undefined || !initials) return

  initials = false

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
