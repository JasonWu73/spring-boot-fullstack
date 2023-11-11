import React from 'react'

import {
  useFetch,
  type AbortCallback,
  type FetchPayload
} from '@/hooks/use-fetch'
import { getFriendsApi, type Friend } from '@/services/fake/friend-api'
import { wait } from '@/utils/helpers'

const STORAGE_KEY = 'demo-friends'

type NewFriend = Omit<Friend, 'id'>

type GetFriendParams = {
  id: number
}

type FriendProviderState = {
  friends: Friend[]
  errorFriends: string
  loadingFriends: boolean
  getFriends: () => AbortCallback

  curFriend: Friend | null
  errorFriend: string
  loadingFriend: boolean
  getFriend: (params: GetFriendParams) => AbortCallback

  addFriend: (friend: NewFriend) => void
  deleteFriend: (id: number) => void

  showAddFriend: boolean
  setShowAddFriend: (show: boolean) => void

  splitBill: (id: number, expense: number) => void
  setCredit: (id: number, creditRating: number) => void
}

const initialState: FriendProviderState = {
  friends: [],
  errorFriends: '',
  loadingFriends: false,
  getFriends: () => () => null,

  curFriend: null,
  errorFriend: '',
  loadingFriend: false,
  getFriend: () => () => null,

  addFriend: () => null,
  deleteFriend: () => null,

  showAddFriend: false,
  setShowAddFriend: () => null,

  splitBill: () => null,
  setCredit: () => null
}

const FriendProviderContext = React.createContext(initialState)

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
      const friends = state.friends.filter(
        (friend) => friend.id !== action.payload
      )
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
            balance: Number(
              (friend.balance - action.payload.expense).toFixed(2)
            )
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
  } = useFetch(async (payload) => {
    const response = await getFriendsApi(payload)

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
  } = useFetch<Friend, GetFriendParams>(async (payload, params) => {
    const response = await fakeGetFriendApi(payload, params)

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
  return React.useContext(FriendProviderContext)
}

function getFriendsFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

async function fakeGetFriendApi(_: FetchPayload, params?: GetFriendParams) {
  if (!params) return { data: null, error: '未传入参数' }

  // 仅为了模拟查看骨架屏的效果
  await wait(2)

  const friends = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '[]'
  ) as Friend[]
  const friend = friends.find((friend) => friend.id === params.id)
  if (friend) return { data: friend, error: '' }

  return { data: null, error: '未找到好友数据' }
}

export { FriendProvider, useFriends }
