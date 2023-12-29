import { requestLocalApi } from '@/shared/apis/local/helpers'
import type { Friend } from '@/split-bill/split-bill-signals'

/**
 * 获取本地 JSON 文件中的好友列表数据。
 *
 * @returns Promise API 响应结果
 */
export async function getFriendsApi() {
  return await requestLocalApi<Friend[]>({ url: '/data/friends.json' })
}
