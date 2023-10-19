import React, { createContext, useContext, useReducer } from 'react'

import { type Friend } from '@/api/fake/friend'

const STORAGE_KEY = 'demo-friends'

type FriendProviderState = {
  friends: Friend[]
  setFriends: (friends: Friend[]) => void
  addFriend: (friend: Friend) => void
  updateFriend: (friend: Friend) => void
  deleteFriend: (friend: Friend) => void

  showAddFriend: boolean
  setShowAddFriend: (show: boolean) => void
}

const FriendProviderContext = createContext<FriendProviderState>(
  {} as FriendProviderState
)

type FriendProviderProps = {
  children: React.ReactNode
}

function createInitialState() {
  const friends = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

  return {
    friends
  } as FriendProviderState
}

type Action =
  | { type: 'setFriends'; payload: Friend[] }
  | { type: 'addFriend'; payload: Friend }
  | { type: 'updateFriend'; payload: Friend }
  | { type: 'deleteFriend'; payload: Friend }
  | { type: 'setShowAddFriend'; payload: boolean }

function reducer(state: FriendProviderState, action: Action) {
  switch (action.type) {
    case 'setFriends': {
      if (state.friends.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))

        return { ...state, friends: action.payload, showAddFriend: false }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.friends))
      return { ...state, showAddFriend: false }
    }
    case 'addFriend': {
      const friends = [...state.friends, action.payload]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return {
        ...state,
        friends,
        showAddFriend: false
      }
    }
    case 'updateFriend': {
      const friends = state.friends.map((f) => {
        if (f.id === action.payload.id) {
          return action.payload
        }

        return f
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return { ...state, friends }
    }
    case 'deleteFriend': {
      const friends = state.friends.filter((f) => f.id !== action.payload.id)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends))

      return { ...state, friends }
    }
    case 'setShowAddFriend': {
      return { ...state, showAddFriend: action.payload }
    }
    default: {
      throw new Error(`未知的 action 类型：${action}`)
    }
  }
}

function FriendProvider({ children }: FriendProviderProps) {
  const [{ friends, showAddFriend }, dispatch] = useReducer(
    reducer,
    null,
    createInitialState
  )

  const value = {
    friends,
    setFriends: (friends: Friend[]) => {
      dispatch({ type: 'setFriends', payload: friends })
    },
    addFriend: (friend: Friend) => {
      dispatch({ type: 'addFriend', payload: friend })
    },
    updateFriend: (friend: Friend) => {
      dispatch({ type: 'updateFriend', payload: friend })
    },
    deleteFriend: (friend: Friend) => {
      dispatch({ type: 'deleteFriend', payload: friend })
    },
    showAddFriend,
    setShowAddFriend: (show: boolean) => {
      dispatch({ type: 'setShowAddFriend', payload: show })
    }
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

export { FriendProvider, useFriends }
