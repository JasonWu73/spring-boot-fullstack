import { type ApiResponse } from '@/lib/use-fetch'
import { sendRequest, type Request } from '@/lib/http'
import { JSEncrypt } from 'jsencrypt'

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIMy5tyS5o94hMLYCofIBKMD0GSREDz07hJk+uJ7CRg9IsIFBpkuuxvGfHBVMMHQZe6JRfpTLW/eSEzx5A3I6vmMs5ZfdjH+QIDvCFko7SWSYh34Vr+AR7fBHli1qwHornRdvH115NKoSm3c+RLjqZb+/RXI/9D4uVrZs7c7eV+wIDAQAB'

// 实际项目中，私钥只存在于服务器端，且传输的是加密数据
const PRIVATE_KEY =
  'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMgzLm3JLmj3iEwtgKh8gEowPQZJEQPPTuEmT64nsJGD0iwgUGmS67G8Z8cFUwwdBl7olF+lMtb95ITPHkDcjq+Yyzll92Mf5AgO8IWSjtJZJiHfhWv4BHt8EeWLWrAeiudF28fXXk0qhKbdz5EuOplv79Fcj/0Pi5Wtmztzt5X7AgMBAAECgYBxFlg3s9j/ejQHs/xlME7XmYAfOM7ftA7+p8GCwvC+ghQK0QYbXN6+u4pzpdJPmWWr3v1ROeQKBck8LDMOuIfwMN4dHnmT529grJW3Q2OVUiJKxm1lEdAJVMJADOZLgYwVCRoCArFv9sRooPH807byVOBEYJOwiSfx6j4hQyShAQJBAO8Yi645WHeh+qjAcdOR5gNu9qOPmsAeCfdpeHdoCttIaNYF1D7w60lZGUku1P1ZeQP3viiCQEYYe47hpcVXOdsCQQDWWqX/D4qUwx3UdF9c4iSHkBP3cYT9qqyt0eldCfXzPXgtZrvhwnncKTTArF43NxwUiw4w30mS+3nPnW3zmR5hAkEAw3HJHI375y8dezx0z4GACGZ4bpNA6LKlav1oYBNIbJ/wMqNpMFo3uyl+JfiGWuL8rWWip/JxH9t7hPynSX1X6QJBAKmqgq3K/WQWtOvPWRRKI6Px1PwNLLkkeR30gwSTt8vaod897AUcTByJuSmwxbpqsp1IG+lvM+tVhethrwAb+MECQQCDQzRTuVZjkOgJ95Zo5bbTgXxWbFXNR1HcwSVC6fMnSckbzDL+GP5XNxuNn2tDLQPRKV9C9tR+IGlqK+QTbNN9'

const STORAGE_KEY = 'demo-auth'

const BASE_URL = 'https://dummyjson.com/auth'

type ApiError = {
  message: string
  name?: string
  expiredAt?: string
}

const EXPIRES_IN_MINS = 1

type AuthResponse = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

type Auth = AuthResponse & { password: string }

type LoginParams = {
  username: string
  password: string
  expiresInMins?: number
}

async function loginApi(
  { username, password }: LoginParams,
  signal?: AbortSignal
): Promise<ApiResponse<Auth>> {
  const { data, error } = await sendRequest<AuthResponse, ApiError>({
    url: `${BASE_URL}/login`,
    method: 'POST',
    bodyData: {
      username: username,
      password: password,
      expiresInMins: EXPIRES_IN_MINS
    },
    signal: signal
  })

  if (error) {
    if (typeof error === 'string') {
      return { data: null, error }
    }

    return { data: null, error: error.message }
  }

  const auth = { ...data, password: password } as Auth

  return { data: auth, error: '' }
}

type SendRequestWrapper = Request & { initialCall?: boolean }

async function sendAuthDummyJsonApi<T>({
  url,
  method = 'GET',
  contentType = 'JSON',
  urlData,
  bodyData,
  signal,
  initialCall = true
}: SendRequestWrapper): Promise<ApiResponse<T>> {
  const auth = getAuthFromLocalStorage()

  if (!auth || !auth.token || !auth.username || !auth.password) {
    return { data: null, error: '未登录', authFailed: true }
  }

  const { data, error } = await sendRequest<T, ApiError>({
    url: `${BASE_URL}/${url}`,
    method,
    contentType,
    headers: { Authorization: `Bearer ${auth.token}` },
    urlData,
    bodyData,
    signal
  })

  if (!error) {
    return { data, error: '' }
  }

  if (typeof error === 'string') {
    return { data: null, error }
  }

  const authFailed =
    error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'

  if (initialCall && authFailed) {
    const { data, error } = await tryReLogin(auth.username, auth.password)

    if (error) {
      return { data: null, error, authFailed: true }
    }

    if (data) {
      return sendAuthDummyJsonApi({
        url,
        method,
        contentType,
        urlData,
        bodyData,
        signal,
        initialCall: false
      })
    }
  }

  return { data: null, error: error.message }
}

async function tryReLogin(
  encryptedUsername: string,
  encryptedPassword: string
) {
  const username = decrypt(encryptedUsername)
  const password = decrypt(encryptedPassword)

  if (!username || !password) {
    removeAuthFromLocalStorage()
    return { data: null, error: '登录缓存数据格式有误' }
  }

  const { data, error } = await loginApi({ username, password })

  if (error) {
    removeAuthFromLocalStorage()
    return { data: null, error }
  }

  if (data) {
    setAuthToLocalStorage(data)
  }

  return { data, error }
}

function encrypt(raw: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(PUBLIC_KEY)
  return encrypt.encrypt(raw)
}

function decrypt(encrypted: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPrivateKey(PRIVATE_KEY)
  return encrypt.decrypt(encrypted) as string
}

function setAuthToLocalStorage(auth: Auth) {
  const encryptedData = {
    ...auth,
    username: encrypt(auth.username),
    password: encrypt(auth.password)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedData))
}

function getAuthFromLocalStorage(): Auth | null {
  const storageValue = localStorage.getItem(STORAGE_KEY)

  if (!storageValue) {
    return null
  }

  return JSON.parse(storageValue)
}

function removeAuthFromLocalStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export {
  loginApi,
  sendAuthDummyJsonApi,
  getAuthFromLocalStorage,
  removeAuthFromLocalStorage,
  setAuthToLocalStorage,
  type Auth
}
