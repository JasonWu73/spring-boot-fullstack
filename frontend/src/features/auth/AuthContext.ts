import {createContext, useContext} from 'react'

import {type AbortCallback} from '@/hooks/use-fetch'

type Auth = {
  id: number
  username: string
  password: string
  token: string
  nickname: string
}

type AuthProviderState = {
  auth: Auth | null
  error: string
  loading: boolean
  login: (username: string, password: string) => AbortCallback
  logout: () => void
  updateToken: (token: string) => void
}

const initialState: AuthProviderState = {
  auth: null,
  error: '',
  loading: false,
  login: () => () => null,
  logout: () => null,
  updateToken: () => null
}

const AuthProviderContext = createContext(initialState)

function useAuth() {
  return useContext(AuthProviderContext)
}

export {AuthProviderContext, useAuth, type AuthProviderState, type Auth}
