import { createContext, useContext } from 'react'

import { type FriendResponse } from '@/services/fake/friend-api'
import { type AbortCallback } from '@/hooks/use-fetch'

type NewFriend = Omit<FriendResponse, 'id'>

type FetchFriendParams = {
  id: number
}

type FriendProviderState = {
  friends: FriendResponse[]
  errorFriends: string
  loadingFriends: boolean
  fetchFriends: () => AbortCallback

  curFriend: FriendResponse | null
  errorFriend: string
  loadingFriend: boolean
  fetchFriend: (params: FetchFriendParams) => AbortCallback

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
  fetchFriends: () => () => null,

  curFriend: null,
  errorFriend: '',
  loadingFriend: false,
  fetchFriend: () => () => null,

  addFriend: () => null,
  deleteFriend: () => null,

  showAddFriend: false,
  setShowAddFriend: () => null,

  splitBill: () => null,
  setCredit: () => null
}

const FriendProviderContext = createContext(initialState)

function useFriends() {
  return useContext(FriendProviderContext)
}

export {
  FriendProviderContext,
  useFriends,
  type FriendProviderState,
  type NewFriend,
  type FetchFriendParams
}