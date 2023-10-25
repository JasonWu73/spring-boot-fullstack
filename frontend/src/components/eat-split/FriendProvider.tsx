import React, { createContext, useContext, useEffect, useReducer } from 'react'

import { type Friend, getFriendsApi } from '@/api/fake/friend'
import { useFetch } from '@/hooks/use-fetch'
import { wait } from '@/lib/utils'

const STORAGE_KEY = 'demo-friends'

type NewFriend = Omit<Friend, 'id'>

type FetchFriendParams = {
  id: number
}

type FriendProviderState = {
  friends: Friend[]
  errorFriends: string
  loadingFriends: boolean
  fetchFriends: () => AbortController

  curFriend: Friend | null
  errorFriend: string
  loadingFriend: boolean
  fetchFriend: (params: FetchFriendParams) => AbortController

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
  return {
    friends: getFriendsFromStorage(),
    curFriend: null,
    showAddFriend: false
  }
}

type Action =
  | { type: 'friends/loadedFailed' }
  | { type: 'friends/loaded'; payload: Friend[] }
  | { type: 'friends/selected'; payload: Friend | null }
  | { type: 'friends/created'; payload: Friend }
  | { type: 'friends/delete'; payload: number }
  | { type: 'formAddFriend/show'; payload: boolean }
  | { type: 'bill/split'; payload: { id: number; expense: number } }
  | { type: 'credit/rank'; payload: { id: number; creditRating: number } }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'friends/loadedFailed': {
      return { ...state, friends: [] }
    }
    case 'friends/loaded': {
      const friends = getFriendsFromStorage()

      if (friends.length > 0) {
        return { ...state, friends }
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
    data: fetchedFriends,
    error: errorFriends,
    loading: loadingFriends,
    fetchData: fetchFriends
  } = useFetch(getFriendsApi)

  useEffect(() => {
    if (fetchedFriends) {
      dispatch({ type: 'friends/loaded', payload: fetchedFriends })
      return
    }

    dispatch({ type: 'friends/loadedFailed' })
  }, [JSON.stringify(fetchedFriends)])

  const {
    data: fetchedFriend,
    error: errorFriend,
    loading: loadingFriend,
    fetchData: fetchFriend
  } = useFetch<Friend, FetchFriendParams>(async (_, params) => {
    if (!params) {
      return { data: null, error: '未传入参数' }
    }

    // 仅为了模拟查看骨架屏的效果
    await wait(1)

    const friends = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    ) as Friend[]

    const friend = friends.find((f) => f.id === params.id)

    if (friend) {
      return { data: friend, error: '' }
    }

    return { data: null, error: '未找到好友数据' }
  })

  useEffect(() => {
    if (fetchedFriend) {
      dispatch({ type: 'friends/selected', payload: fetchedFriend })
      return
    }

    dispatch({ type: 'friends/selected', payload: null })
  }, [JSON.stringify(fetchedFriend)])

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
    fetchFriends,

    curFriend,
    errorFriend,
    loadingFriend,
    fetchFriend,

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

function getFriendsFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export { FriendProvider, useFriends }
