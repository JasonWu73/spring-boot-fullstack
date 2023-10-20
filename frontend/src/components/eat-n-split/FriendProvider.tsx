import React, { createContext, useContext, useReducer } from 'react'

import { type Friend, getFriendsApi } from '@/api/fake/friend'
import { useFetch } from '@/hooks/use-fetch'
import { wait } from '@/lib/utils'

const STORAGE_KEY = 'demo-friends'

type NewFriend = Omit<Friend, 'id'>

type FriendProviderState = {
  friends: Friend[]
  errorFriends: string
  loadingFriends: boolean
  curFriend: Friend | null
  errorFriend: string
  loadingFriend: boolean
  getFriends: () => Promise<void>
  getFriend: (id: number) => Promise<void>
  addFriend: (friend: NewFriend) => void
  deleteFriend: (id: number) => void

  showAddFriend: boolean
  setShowAddFriend: (show: boolean) => void

  splitBill: (id: number, expense: number) => void
  setCredit: (id: number, creditRating: number) => void
}

const FriendProviderContext = createContext<FriendProviderState>(
  {} as FriendProviderState
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
  const friends = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

  return {
    friends,
    curFriend: null,
    showAddFriend: false
  }
}

type Action =
  | { type: 'friends/loaded'; payload: Friend[] }
  | { type: 'friends/selected'; payload: Friend | null }
  | { type: 'friends/created'; payload: Friend }
  | { type: 'friends/delete'; payload: number }
  | { type: 'formAddFriend/show'; payload: boolean }
  | { type: 'bill/split'; payload: { id: number; expense: number } }
  | { type: 'credit/rank'; payload: { id: number; creditRating: number } }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'friends/loaded': {
      if (state.friends.length > 0) {
        return state
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))

      return { ...state, friends: action.payload }
    }
    case 'friends/selected': {
      return {
        ...state,
        curFriend: action.payload
      }
    }
    case 'friends/created': {
      const friends = [...state.friends, action.payload]

      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return { ...state, friends }
    }
    case 'friends/delete': {
      const friends = state.friends.filter((f) => f.id !== action.payload)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return {
        ...state,
        friends
      }
    }
    case 'formAddFriend/show': {
      return { ...state, showAddFriend: action.payload }
    }
    case 'bill/split': {
      const friends = state.friends.map((f) => {
        if (f.id === action.payload.id) {
          return {
            ...f,
            balance: Number((f.balance - action.payload.expense).toFixed(2))
          }
        }

        return f
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return {
        ...state,
        friends
      }
    }
    case 'credit/rank': {
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
  const [{ friends, curFriend, showAddFriend }, dispatch] = useReducer(
    reducer,
    null,
    createInitialState
  )

  const {
    error: errorFriends,
    loading: loadingFriends,
    getFriends: sendGetFriends
  } = useFriendsApi()

  async function getFriends() {
    const { data } = await sendGetFriends()

    if (data) {
      dispatch({ type: 'friends/loaded', payload: data })
      return
    }

    dispatch({ type: 'friends/loaded', payload: [] })
  }

  const {
    error: errorFriend,
    loading: loadingFriend,
    getFriend: fakeGetFriend
  } = useFriendApi()

  async function getFriend(id: number) {
    const { data } = await fakeGetFriend(id)

    if (data) {
      dispatch({ type: 'friends/selected', payload: data })
      return
    }

    dispatch({ type: 'friends/selected', payload: null })
  }

  function addFriend(friend: NewFriend) {
    dispatch({
      type: 'friends/created',
      payload: { ...friend, id: Date.now() }
    })
  }

  function deleteFriend(id: number) {
    dispatch({ type: 'friends/delete', payload: id })
  }

  function setShowAddFriend(show: boolean) {
    dispatch({ type: 'formAddFriend/show', payload: show })
  }

  function setCredit(id: number, creditRating: number) {
    dispatch({ type: 'credit/rank', payload: { id, creditRating } })
  }

  function splitBill(id: number, expense: number) {
    dispatch({ type: 'bill/split', payload: { id, expense } })
  }

  const value = {
    friends,
    errorFriends,
    loadingFriends,
    curFriend,
    errorFriend,
    loadingFriend,
    getFriends,
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
  const context = useContext(FriendProviderContext)

  if (context === undefined) {
    throw new Error('useFriends 必须在 FriendProvider 中使用')
  }

  return context
}

function useFriendsApi() {
  const {
    error,
    loading,
    fetchData: getFriends
  } = useFetch(async (_, { signal }) => {
    return await getFriendsApi(signal)
  }, false)

  return { error, loading, getFriends }
}

function useFriendApi() {
  const {
    error,
    loading,
    fetchData: getFriend
  } = useFetch<Friend, number>(async (id) => {
    // 仅为了模拟查看骨架屏的效果
    await wait(1)

    const friends = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    ) as Friend[]

    const friend = friends.find((f) => f.id === id)

    if (friend) {
      return { data: friend, error: '' }
    }

    return { data: null, error: '未找到好友数据' }
  }, false)

  return { error, loading, getFriend }
}

export { FriendProvider, useFriends }
