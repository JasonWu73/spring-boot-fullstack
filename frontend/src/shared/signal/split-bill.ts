import { signal } from '@preact/signals-react'

const STORAGE_KEY = 'demo-friends'

export type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
  birthday: string
}

type SplitBill = {
  /**
   * 好友列表。
   */
  friends: Friend[]

  /**
   * 是否显示添加好友的表单。
   */
  showAddFriend: boolean
}

/**
 * 分账数据 Signal。
 */
export const splitBill = signal<SplitBill>(undefined as unknown as SplitBill)

/**
 * 创建分账数据 Signal。
 * <p>
 * 仅可在应用启动时初始化一次。
 */
export function createSplitBillState() {
  if (splitBill.value !== undefined) return

  splitBill.value = {
    friends: getStorageFriends(),
    showAddFriend: false
  }
}

/**
 * 是否显示添加好友的表单。
 *
 * @returns show 是否显示
 */
export function showAddFriend(show: boolean) {
  splitBill.value = {
    ...splitBill.value,
    showAddFriend: show
  }
}

/**
 * 设置好友列表。
 * <p>
 * 若本地存储中已有好友列表数据，则不会覆盖。
 *
 * @param friends 好友列表
 */
export function setFriends(friends: Friend[]) {
  if (getStorageFriends().length > 0) return

  splitBill.value.friends = friends

  setStorageFriends(friends)
}

/**
 * 添加好友。
 *
 * @param friend 要添加的好友
 */
export function addFriend(friend: Friend) {
  splitBill.value.friends = [...splitBill.value.friends, friend]

  setStorageFriends(splitBill.value.friends)
}

/**
 * 删除好友。
 *
 * @param friendId 要删除的好友 ID
 */
export function deleteFriend(friendId: number) {
  splitBill.value.friends = splitBill.value.friends.filter(
    (friend) => friend.id !== friendId
  )

  setStorageFriends(splitBill.value.friends)
}

/**
 * 更新好友的余额。
 *
 * @param friendId 好友 ID
 * @param expense 本次消费金额
 */
export function updateBalance(friendId: number, expense: number) {
  splitBill.value = {
    ...splitBill.value,
    friends: splitBill.value.friends.map((friend) => {
      if (friend.id === friendId) {
        return {
          ...friend,
          balance: Number((friend.balance - expense).toFixed(2))
        }
      }

      return friend
    })
  }

  setStorageFriends(splitBill.value.friends)
}

/**
 * 更新好友的信用等级。
 *
 * @param friendId 好友 ID
 * @param creditRating 最新的信用等级
 */
export function updateCredit(friendId: number, creditRating: number) {
  splitBill.value = {
    ...splitBill.value,
    friends: splitBill.value.friends.map((friend) => {
      if (friend.id === friendId) {
        return {
          ...friend,
          creditRating
        }
      }

      return friend
    })
  }

  setStorageFriends(splitBill.value.friends)
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
