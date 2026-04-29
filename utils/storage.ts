import { AUTH_STORAGE_KEY } from "@/config/auth"
import type { StoredSession } from "@/types/auth"

export function saveStoredSession(value: StoredSession): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value))
}

export function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as StoredSession
  } catch {
    return null
  }
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
