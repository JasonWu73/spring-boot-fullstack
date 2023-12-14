import { requestLocalApi } from '@/shared/apis/local/helpers'
import type { Friend } from '@/shared/signals/split-bill'

/**
 * 获取本地 JSON 文件中的好友列表数据。
 *
 * @returns Promise API 响应结果
 */
export async function getLocalFriends() {
  return await requestLocalApi<Friend[]>({ url: '/data/friends.json' })
}
