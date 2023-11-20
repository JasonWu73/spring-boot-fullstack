export type User = {
  id: number
  createdAt: string
  updatedAt: string
  remark: string
  username: string
  nickname: string
  status: number
  authorities: string[]
}

export type GetUserParams = {
  username?: string
  nickname?: string
  status?: string
  authority?: string
}
