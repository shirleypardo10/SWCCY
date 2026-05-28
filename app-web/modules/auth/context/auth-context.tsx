"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { clearAuthCookie, writeAuthCookie } from "@/utils/cookies"
import { buildSessionToken } from "@/utils/session"
import { clearStoredSession, readStoredSession, saveStoredSession } from "@/utils/storage"
import { apiRequest, clearAccessToken, loginRequest, setAccessToken } from "@/lib/api"
import type { AuthState, AuthUser, LoginInput, LoginResult } from "@/types/auth"

interface AuthContextValue extends AuthState {
  login: (credentials: LoginInput) => Promise<LoginResult>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

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

  if (!storedSession.accessToken || !storedSession.user || storedSession.user.status !== "activo") {
    clearStoredSession()
    clearAccessToken()
    clearAuthCookie()
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  }

  return {
    user: storedSession.user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => getInitialAuthState())

  useEffect(() => {
    let cancelled = false
    const storedSession = readStoredSession()
    if (storedSession?.accessToken) {
      setAccessToken(storedSession.accessToken)
      apiRequest("/auth/profile").catch(() => {
        if (cancelled) {
          return
        }
        clearStoredSession()
        clearAccessToken()
        clearAuthCookie()
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      })
    }
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials: LoginInput): Promise<LoginResult> => {
    setState((current) => ({ ...current, isLoading: true, error: null }))

    try {
      const { accessToken, user } = await loginRequest(credentials)
      setAccessToken(accessToken)

      saveStoredSession({
        userId: user.id,
        role: user.role,
        accessToken,
        user,
      })

      const sessionToken = buildSessionToken({
        userId: user.id,
        role: user.role,
        issuedAt: Date.now(),
      })

      writeAuthCookie(sessionToken)

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Credenciales inválidas."
      setState((current) => ({ ...current, error: message, isLoading: false }))
      return { success: false, message }
    }
  }, [])

  const logout = useCallback(() => {
    clearStoredSession()
    clearAccessToken()
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
