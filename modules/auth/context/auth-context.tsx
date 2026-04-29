"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { clearAuthCookie, writeAuthCookie } from "@/utils/cookies"
import { buildSessionToken } from "@/utils/session"
import { clearStoredSession, readStoredSession, saveStoredSession } from "@/utils/storage"
import { MOCK_USERS } from "@/mocks/users"
import type { AuthState, AuthUser, LoginInput, LoginResult } from "@/types/auth"

interface AuthContextValue extends AuthState {
  login: (credentials: LoginInput) => Promise<LoginResult>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toAuthUser(user: (typeof MOCK_USERS)[number]): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
  }
}

function getUserById(userId: string) {
  return MOCK_USERS.find((user) => user.id === userId)
}

function getInitialAuthState(): AuthState {
  const storedSession = readStoredSession()

  if (!storedSession) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  }

  const matchedUser = getUserById(storedSession.userId)

  if (!matchedUser || matchedUser.status !== "activo") {
    clearStoredSession()
    clearAuthCookie()
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  }

  return {
    user: toAuthUser(matchedUser),
    isAuthenticated: true,
    isLoading: false,
    error: null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => getInitialAuthState())

  const login = useCallback(async (credentials: LoginInput): Promise<LoginResult> => {
    const normalizedEmail = credentials.email.trim().toLowerCase()

    const matchedUser = MOCK_USERS.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === credentials.password
    )

    if (!matchedUser) {
      const message = "Credenciales inválidas. Revisa correo y contraseña."
      setState((current) => ({ ...current, error: message, isLoading: false }))
      return { success: false, message }
    }

    if (matchedUser.status !== "activo") {
      const message = "Tu cuenta está inactiva. Contacta al administrador comercial."
      setState((current) => ({ ...current, error: message, isLoading: false }))
      return { success: false, message }
    }

    const authUser = toAuthUser(matchedUser)

    saveStoredSession({
      userId: authUser.id,
      role: authUser.role,
    })

    const sessionToken = buildSessionToken({
      userId: authUser.id,
      role: authUser.role,
      issuedAt: Date.now(),
    })

    writeAuthCookie(sessionToken)

    setState({
      user: authUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    clearStoredSession()
    clearAuthCookie()
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setState((current) => ({ ...current, error: null }))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      clearError,
    }),
    [clearError, login, logout, state]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider")
  }

  return context
}
