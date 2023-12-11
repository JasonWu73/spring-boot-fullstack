import { effect, signal } from '@preact/signals-react'

const STORAGE_KEY = 'demo-friends'

export type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
  birthday: string
}

/**
 * 好友列表 Signal。
 */
export const friends = signal(undefined as unknown as Friend[])

/**
 * 是否显示添加好友的表单 Signal。
 */
export const showAddFriend = signal(false)

/**
 * 创建分账数据 Signal。
 * <p>
 * 仅可在应用启动时初始化一次。
 */
export function createSplitBillState() {
  if (friends.value !== undefined) return

  friends.value = getStorageFriends()

  effect(() => {
    setStorageFriends(friends.value)
  })
}

/**
 * 设置好友列表。
 * <p>
 * 若本地存储中已有好友列表数据，则不会覆盖。
 *
 * @param newFriends 好友列表
 */
export function setFriends(newFriends: Friend[]) {
  if (getStorageFriends().length > 0) return

  friends.value = newFriends
}

/**
 * 添加好友。
 *
 * @param friend 要添加的好友
 */
export function addFriend(friend: Friend) {
  friends.value = [...friends.value, friend]
}

/**
 * 删除好友。
 *
 * @param friendId 要删除的好友 ID
 */
export function deleteFriend(friendId: number) {
  friends.value = friends.value.filter((friend) => friend.id !== friendId)
}

/**
 * 更新好友的余额。
 *
 * @param friendId 好友 ID
 * @param expense 本次消费金额
 */
export function updateBalance(friendId: number, expense: number) {
  friends.value = friends.value.map((friend) => {
    if (friend.id === friendId) {
      return {
        ...friend,
        balance: Number((friend.balance - expense).toFixed(2))
      }
    }

    return friend
  })
}

/**
 * 更新好友的信用等级。
 *
 * @param friendId 好友 ID
 * @param creditRating 最新的信用等级
 */
export function updateCredit(friendId: number, creditRating: number) {
  friends.value = friends.value.map((friend) => {
    if (friend.id === friendId) {
      return {
        ...friend,
        creditRating
      }
    }

    return friend
  })
}

/**
 * 从本地存储中获取好友列表。
 *
 * @returns Friend[] 好友列表
 */
export function getStorageFriends(): Friend[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

function setStorageFriends(friends: Friend[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))
}
