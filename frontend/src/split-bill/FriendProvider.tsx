import React from 'react'

const STORAGE_KEY = 'demo-friends'

type Friend = {
  id: number
  name: string
  image: string
  balance: number
  creditRating: number
  birthday: string
}

type FriendProviderState = {
  friends: Friend[]
  showAddFriend: boolean
  dispatch: React.Dispatch<Action>
}

const FriendProviderContext = React.createContext(null as unknown as FriendProviderState)

type FriendProviderProps = {
  children: React.ReactNode
}

type State = {
  friends: Friend[]
  currentFriend: Friend | null
  showAddFriend: boolean
}

function createInitialState() {
  return {
    friends: getFriendsFromStorage(),
    currentFriend: null,
    showAddFriend: false
  }
}

type Action =
  | { type: 'SET_FRIENDS'; payload: Friend[] }
  | { type: 'SELECT_FRIEND'; payload: Friend | null }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'DELETE_FRIEND'; payload: number }
  | { type: 'SHOW_ADD_FRIEND_FORM'; payload: boolean }
  | { type: 'SPLIT_BILL'; payload: { id: number; expense: number } }
  | { type: 'RATE_CREDIT_RANK'; payload: { id: number; creditRating: number } }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_FRIENDS': {
      const friends = getFriendsFromStorage()

      if (friends.length > 0) return { ...state, friends }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))

      return { ...state, friends: action.payload }
    }
    case 'SELECT_FRIEND': {
      return {
        ...state,
        currentFriend: action.payload
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
  const [{ friends, showAddFriend }, dispatch] = React.useReducer(
    reducer,
    null,
    createInitialState
  )

  const value: FriendProviderState = {
    friends,
    showAddFriend,
    dispatch
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

function getFriendsFromStorage(): Friend[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export { FriendProvider, getFriendsFromStorage, useFriends, type Friend }
