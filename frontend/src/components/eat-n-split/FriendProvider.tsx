import React, { createContext, useContext } from 'react'

import { type Friend } from '@/api/fake/friend-api'
import { useLocalStorageState } from '@/lib/use-storage'

type FriendProviderState = {
  friends: Friend[]
  setFriends: (friends: Friend[]) => void
}

const initialState: FriendProviderState = {
  friends: [],
  setFriends: () => {}
}

const FriendProviderContext = createContext<FriendProviderState>(initialState)

type FriendProviderProps = {
  children: React.ReactNode
}

const STORAGE_KEY = 'friends'

function FriendProvider({ children }: FriendProviderProps) {
  const [friends, setFriends] = useLocalStorageState(
    STORAGE_KEY,
    [] as Friend[]
  )

  const value = {
    friends,
    setFriends: (friends: Friend[]) => {
      setFriends(friends)
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
