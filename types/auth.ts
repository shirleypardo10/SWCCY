export const ROLE_VALUES = ["cliente", "vendedor", "gerente", "produccion"] as const
export type Role = (typeof ROLE_VALUES)[number]

export const USER_STATUS_VALUES = ["activo", "inactivo"] as const
export type UserStatus = (typeof USER_STATUS_VALUES)[number]

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  status: UserStatus
  password: string
}

export type AuthUser = Omit<User, "password">

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
}
