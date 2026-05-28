export const ROLE_VALUES = ["ADMIN", "GERENTE", "VENDEDOR", "PRODUCTOR", "ALMACENERO"] as const
export type Role = (typeof ROLE_VALUES)[number]

export const USER_STATUS_VALUES = ["activo", "inactivo"] as const
export type UserStatus = (typeof USER_STATUS_VALUES)[number]

export interface User {
  id: string
  fullName: string
  email: string
  role: Role
  status: UserStatus
  isActive?: boolean
}

export type AuthUser = User

export interface SessionPayload {
  userId: string
  role: Role
  issuedAt: number
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResult {
  success: boolean
  message?: string
}

export interface StoredSession {
  userId: string
  role: Role
  accessToken: string
  user: AuthUser
}
