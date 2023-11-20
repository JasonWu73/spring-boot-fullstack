// 这里假设 Vite 运行时使用默认的 5173 端口
const DEV_PORT = '5173'
const BACKEND_BASE_URL =
  window.location.protocol + '//' + window.location.hostname + ':8080'

export const BASE_URL =
  window.location.port === DEV_PORT ? BACKEND_BASE_URL : window.location.host
