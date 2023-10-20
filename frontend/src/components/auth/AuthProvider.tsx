import React, { createContext, useContext, useState } from 'react'

import { useFetch } from '@/hooks/use-fetch'
import { type AuthResponse, loginApi } from '@/api/dummyjson/auth'
import { decrypt, encrypt } from '@/lib/rsa'

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIMy5tyS5o94hMLYCofIBKMD0GSREDz07hJk+uJ7CRg9IsIFBpkuuxvGfHBVMMHQZe6JRfpTLW/eSEzx5A3I6vmMs5ZfdjH+QIDvCFko7SWSYh34Vr+AR7fBHli1qwHornRdvH115NKoSm3c+RLjqZb+/RXI/9D4uVrZs7c7eV+wIDAQAB'

// 实际项目中，私钥只存在于服务器端，且传输的是加密数据
const PRIVATE_KEY =
  'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMgzLm3JLmj3iEwtgKh8gEowPQZJEQPPTuEmT64nsJGD0iwgUGmS67G8Z8cFUwwdBl7olF+lMtb95ITPHkDcjq+Yyzll92Mf5AgO8IWSjtJZJiHfhWv4BHt8EeWLWrAeiudF28fXXk0qhKbdz5EuOplv79Fcj/0Pi5Wtmztzt5X7AgMBAAECgYBxFlg3s9j/ejQHs/xlME7XmYAfOM7ftA7+p8GCwvC+ghQK0QYbXN6+u4pzpdJPmWWr3v1ROeQKBck8LDMOuIfwMN4dHnmT529grJW3Q2OVUiJKxm1lEdAJVMJADOZLgYwVCRoCArFv9sRooPH807byVOBEYJOwiSfx6j4hQyShAQJBAO8Yi645WHeh+qjAcdOR5gNu9qOPmsAeCfdpeHdoCttIaNYF1D7w60lZGUku1P1ZeQP3viiCQEYYe47hpcVXOdsCQQDWWqX/D4qUwx3UdF9c4iSHkBP3cYT9qqyt0eldCfXzPXgtZrvhwnncKTTArF43NxwUiw4w30mS+3nPnW3zmR5hAkEAw3HJHI375y8dezx0z4GACGZ4bpNA6LKlav1oYBNIbJ/wMqNpMFo3uyl+JfiGWuL8rWWip/JxH9t7hPynSX1X6QJBAKmqgq3K/WQWtOvPWRRKI6Px1PwNLLkkeR30gwSTt8vaod897AUcTByJuSmwxbpqsp1IG+lvM+tVhethrwAb+MECQQCDQzRTuVZjkOgJ95Zo5bbTgXxWbFXNR1HcwSVC6fMnSckbzDL+GP5XNxuNn2tDLQPRKV9C9tR+IGlqK+QTbNN9'

const STORAGE_KEY = 'demo-auth'

type Auth = {
  id: number
  username: string
  password: string
  token: string
  nickname: string
}

type LoginParams = {
  username: string
  password: string
}

type LoginMessage = { isOk: true } | { isOk: false; message: string }

type AuthProviderState = {
  auth: Auth | null
  error: string
  loading: boolean
  login: (username: string, password: string) => Promise<LoginMessage>
  resetLogin: () => void
  logout: () => void
  updateToken: (token: string) => void
}

const AuthProviderContext = createContext({} as AuthProviderState)

type AuthProviderProps = {
  children: React.ReactNode
}

function createInitialAuthState(): Auth | null {
  const storageAuth = localStorage.getItem(STORAGE_KEY)

  if (!storageAuth) {
    return null
  }

  const encryptedAuth = JSON.parse(storageAuth)

  const username = decrypt(PRIVATE_KEY, encryptedAuth.username)
  const password = decrypt(PRIVATE_KEY, encryptedAuth.password)

  return { ...encryptedAuth, username, password }
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState(createInitialAuthState)

  const { error, loading, login: sendLogin, resetLogin } = useLoginAPi()

  async function login(
    username: string,
    password: string
  ): Promise<LoginMessage> {
    const { data, error } = await sendLogin({ username, password })

    if (error) {
      setAuth(null)

      return { isOk: false, message: error }
    }

    if (data) {
      const authData = {
        id: data.id,
        username,
        password,
        token: data.token,
        nickname: data.firstName + ' ' + data.lastName
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...authData,
          username: encrypt(PUBLIC_KEY, username),
          password: encrypt(PUBLIC_KEY, password)
        })
      )

      setAuth(authData)

      return { isOk: true }
    }

    return { isOk: false, message: '登录失败' }
  }

  function logout() {
    setAuth(null)
  }

  function updateToken(token: string) {
    setAuth((prev) => {
      if (!prev) {
        return null
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...prev,
          token,
          username: encrypt(PUBLIC_KEY, prev.username),
          password: encrypt(PUBLIC_KEY, prev.password)
        })
      )

      return { ...prev, token }
    })
  }

  const value = {
    auth,
    error,
    loading,
    login,
    resetLogin,
    logout,
    updateToken
  }

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthProviderContext)

  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 中使用')
  }

  return context
}

function useLoginAPi() {
  const {
    error,
    loading,
    fetchData: login,
    reset: resetLogin
  } = useFetch<AuthResponse, LoginParams>(async (params, { signal }) => {
    return await loginApi(params!, signal)
  }, false)

  return { error, loading, login, resetLogin }
}

export { AuthProvider, useAuth, type Auth }
