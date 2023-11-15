import React from 'react'

import { loginApi } from '@/shared/apis/dummyjson/auth-api'
import type { LoginParams, LoginResult } from '@/shared/apis/dummyjson/types'
import type { AbortFetch, Auth } from '@/shared/hooks/types'
import { useFetch } from '@/shared/hooks/use-fetch'
import { decrypt, encrypt } from '@/shared/utils/rsa'

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIMy5tyS5o94hMLYCofIBKMD0GSREDz07hJk+uJ7CRg9IsIFBpkuuxvGfHBVMMHQZe6JRfpTLW/eSEzx5A3I6vmMs5ZfdjH+QIDvCFko7SWSYh34Vr+AR7fBHli1qwHornRdvH115NKoSm3c+RLjqZb+/RXI/9D4uVrZs7c7eV+wIDAQAB'

// 实际项目中，私钥只存在于服务器端，且传输的是加密数据
const PRIVATE_KEY =
  'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMgzLm3JLmj3iEwtgKh8gEowPQZJEQPPTuEmT64nsJGD0iwgUGmS67G8Z8cFUwwdBl7olF+lMtb95ITPHkDcjq+Yyzll92Mf5AgO8IWSjtJZJiHfhWv4BHt8EeWLWrAeiudF28fXXk0qhKbdz5EuOplv79Fcj/0Pi5Wtmztzt5X7AgMBAAECgYBxFlg3s9j/ejQHs/xlME7XmYAfOM7ftA7+p8GCwvC+ghQK0QYbXN6+u4pzpdJPmWWr3v1ROeQKBck8LDMOuIfwMN4dHnmT529grJW3Q2OVUiJKxm1lEdAJVMJADOZLgYwVCRoCArFv9sRooPH807byVOBEYJOwiSfx6j4hQyShAQJBAO8Yi645WHeh+qjAcdOR5gNu9qOPmsAeCfdpeHdoCttIaNYF1D7w60lZGUku1P1ZeQP3viiCQEYYe47hpcVXOdsCQQDWWqX/D4qUwx3UdF9c4iSHkBP3cYT9qqyt0eldCfXzPXgtZrvhwnncKTTArF43NxwUiw4w30mS+3nPnW3zmR5hAkEAw3HJHI375y8dezx0z4GACGZ4bpNA6LKlav1oYBNIbJ/wMqNpMFo3uyl+JfiGWuL8rWWip/JxH9t7hPynSX1X6QJBAKmqgq3K/WQWtOvPWRRKI6Px1PwNLLkkeR30gwSTt8vaod897AUcTByJuSmwxbpqsp1IG+lvM+tVhethrwAb+MECQQCDQzRTuVZjkOgJ95Zo5bbTgXxWbFXNR1HcwSVC6fMnSckbzDL+GP5XNxuNn2tDLQPRKV9C9tR+IGlqK+QTbNN9'

const STORAGE_KEY = 'demo-auth'

type AuthProviderState = {
  auth: Auth | null
  error: string
  loading: boolean
  login: (username: string, password: string) => AbortFetch
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

const AuthProviderContext = React.createContext(initialState)

type AuthProviderProps = {
  children: React.ReactNode
}

function createInitialAuthState(): Auth | null {
  const storageAuth = localStorage.getItem(STORAGE_KEY)
  if (!storageAuth) return null

  const encryptedAuth = JSON.parse(storageAuth)
  const username = decrypt(PRIVATE_KEY, encryptedAuth.username)
  const password = decrypt(PRIVATE_KEY, encryptedAuth.password)
  return { ...encryptedAuth, username, password }
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = React.useState(createInitialAuthState)
  const {
    error,
    loading,
    fetchData: Login
  } = useFetch<LoginResult, LoginParams>(async (payload, params) => {
    const response = await loginApi(payload, params)

    const { data } = response
    data && saveAuth(data, setAuth)

    return response
  })

  function logout() {
    setAuth(null)
    deleteLocalStorageAuth()
  }

  function updateToken(token: string) {
    setAuth((prevAuth) => {
      if (!prevAuth) return null

      const nextAuth = { ...prevAuth, token }
      saveLocalStorageAuth(nextAuth)

      return nextAuth
    })
  }

  const value: AuthProviderState = {
    auth,
    error,
    loading,
    login: (username, password) => Login({ username, password }),
    logout,
    updateToken
  }

  return (
    <AuthProviderContext.Provider value={value}>{children}</AuthProviderContext.Provider>
  )
}

function useAuth() {
  return React.useContext(AuthProviderContext)
}

function saveAuth(data: LoginResult, setAuth: React.Dispatch<Auth | null>) {
  const authData = {
    id: data.id,
    username: data.username,
    password: data.password,
    token: data.token,
    nickname: data.firstName + ' ' + data.lastName
  }

  saveLocalStorageAuth(authData)
  setAuth(authData)
}

function saveLocalStorageAuth(auth: Auth) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...auth,
      username: encrypt(PUBLIC_KEY, auth.username),
      password: encrypt(PUBLIC_KEY, auth.password)
    })
  )
}

function deleteLocalStorageAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

export { AuthProvider, useAuth }
