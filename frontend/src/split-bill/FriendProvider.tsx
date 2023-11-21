import React from 'react'

import { getFriendsApi, type Friend } from '@/shared/apis/fake/friend-api'
import { useFetch, type IgnoreFetch } from '@/shared/hooks/use-fetch'
import { wait } from '@/shared/utils/helpers'
import { CUSTOM_HTTP_STATUS_ERROR_CODE } from '@/shared/utils/http'
import { endNProgress, startNProgress } from '@/shared/utils/nprogress'

const STORAGE_KEY = 'demo-friends'

type NewFriend = Omit<Friend, 'id'>

type GetFriendParams = {
  id: number
}

type FriendProviderState = {
  friends: Friend[]
  errorFriends: string
  loadingFriends: boolean
  getFriends: () => IgnoreFetch

  curFriend: Friend | null
  errorFriend: string
  loadingFriend: boolean
  getFriend: (params: GetFriendParams) => IgnoreFetch

  addFriend: (friend: NewFriend) => void
  deleteFriend: (id: number) => void

  showAddFriend: boolean
  setShowAddFriend: (show: boolean) => void

  splitBill: (id: number, expense: number) => void
  setCredit: (id: number, creditRating: number) => void
}

const FriendProviderContext = React.createContext(
  undefined as unknown as FriendProviderState
)

type FriendProviderProps = {
  children: React.ReactNode
}

type State = {
  friends: Friend[]
  curFriend: Friend | null
  showAddFriend: boolean
}

function createInitialState() {
  return {
    friends: getFriendsFromStorage(),
    curFriend: null,
    showAddFriend: false
  }
}

type Action =
  | { type: 'GET_FRIENDS_FAILED' }
  | { type: 'SET_FRIENDS'; payload: Friend[] }
  | { type: 'SELECT_FRIEND'; payload: Friend | null }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'DELETE_FRIEND'; payload: number }
  | { type: 'SHOW_ADD_FRIEND_FORM'; payload: boolean }
  | { type: 'SPLIT_BILL'; payload: { id: number; expense: number } }
  | { type: 'RATE_CREDIT_RANK'; payload: { id: number; creditRating: number } }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'GET_FRIENDS_FAILED': {
      return { ...state, friends: [] }
    }
    case 'SET_FRIENDS': {
      const friends = getFriendsFromStorage()
      if (friends.length > 0) return { ...state, friends }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))

      return { ...state, friends: action.payload }
    }
    case 'SELECT_FRIEND': {
      return {
        ...state,
        curFriend: action.payload
      }
    }
    case 'ADD_FRIEND': {
      const friends = [...state.friends, action.payload]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return { ...state, friends }
    }
    case 'DELETE_FRIEND': {
      const friends = state.friends.filter((friend) => friend.id !== action.payload)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return {
        ...state,
        friends
      }
    }
    case 'SHOW_ADD_FRIEND_FORM': {
      return { ...state, showAddFriend: action.payload }
    }
    case 'SPLIT_BILL': {
      const friends = state.friends.map((friend) => {
        if (friend.id === action.payload.id) {
          return {
            ...friend,
            balance: Number((friend.balance - action.payload.expense).toFixed(2))
          }
        }

        return friend
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return {
        ...state,
        friends
      }
    }
    case 'RATE_CREDIT_RANK': {
      const friends = state.friends.map((f) => {
        if (f.id === action.payload.id) {
          return { ...f, creditRating: action.payload.creditRating }
        }

        return f
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return {
        ...state,
        friends
      }
    }
    default: {
      throw new Error(`未知的 action 类型：${action}`)
    }
  }
}

function FriendProvider({ children }: FriendProviderProps) {
  const [{ friends, curFriend, showAddFriend }, dispatch] = React.useReducer(
    reducer,
    null,
    createInitialState
  )

  const {
    error: errorFriends,
    loading: loadingFriends,
    fetchData: getFriends
  } = useFetch(async () => {
    const response = await getFriendsApi()

    if (response.error) {
      dispatch({ type: 'GET_FRIENDS_FAILED' })
    }

    if (response.data) {
      dispatch({ type: 'SET_FRIENDS', payload: response.data })
    }

    return response
  })

  const {
    error: errorFriend,
    loading: loadingFriend,
    fetchData: getFriend
  } = useFetch(async (params?: GetFriendParams) => {
    if (!params) {
      return { status: CUSTOM_HTTP_STATUS_ERROR_CODE, data: null, error: '参数缺失' }
    }

    const response = await fakeGetFriendApi(params)

    if (response.error) {
      dispatch({ type: 'SELECT_FRIEND', payload: null })
    }

    if (response.data) {
      dispatch({ type: 'SELECT_FRIEND', payload: response.data })
    }

    return response
  })

  function addFriend(friend: NewFriend) {
    dispatch({
      type: 'ADD_FRIEND',
      payload: { ...friend, id: Date.now() }
    })
  }

  function deleteFriend(id: number) {
    dispatch({ type: 'DELETE_FRIEND', payload: id })
  }

  function setShowAddFriend(show: boolean) {
    dispatch({ type: 'SHOW_ADD_FRIEND_FORM', payload: show })
  }

  function setCredit(id: number, creditRating: number) {
    dispatch({ type: 'RATE_CREDIT_RANK', payload: { id, creditRating } })
  }

  function splitBill(id: number, expense: number) {
    dispatch({ type: 'SPLIT_BILL', payload: { id, expense } })
  }

  const value: FriendProviderState = {
    friends,
    errorFriends,
    loadingFriends,
    getFriends,

    curFriend,
    errorFriend,
    loadingFriend,
    getFriend,

    addFriend,
    deleteFriend,

    showAddFriend,
    setShowAddFriend,

    splitBill,
    setCredit
  }

  return (
    <FriendProviderContext.Provider value={value}>
      {children}
    </FriendProviderContext.Provider>
  )
}

function useFriends() {
  const context = React.useContext(FriendProviderContext)
  if (context === undefined) {
    throw new Error('useFriends 必须在 FriendProvider 中使用')
  }
  return context
}

function getFriendsFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

async function fakeGetFriendApi(params: GetFriendParams) {
  startNProgress()

  // 仅为了模拟查看骨架屏的效果
  await wait(2)

  const friends = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Friend[]
  const friend = friends.find((friend) => friend.id === params.id)

  endNProgress()

  if (friend) return { status: 200, data: friend, error: '' }

  return { status: 404, data: null, error: '未找到好友数据' }
}

export { FriendProvider, useFriends }
