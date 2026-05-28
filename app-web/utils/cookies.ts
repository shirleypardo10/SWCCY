import { AUTH_COOKIE_KEY, AUTH_COOKIE_MAX_AGE_SECONDS } from "@/config/auth"

export function writeAuthCookie(token: string): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE_SECONDS}; samesite=lax`
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`
}
