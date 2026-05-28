"use client"

import type { AuthUser, LoginInput } from "@/types/auth"

export interface ApiListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  meta?: ApiListMeta
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"
const TOKEN_KEY = "yameza.auth.token"

function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(path, API_URL)
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

export function getAccessToken() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { query?: Record<string, string | number | undefined> } = {}
): Promise<{ data: T; meta?: ApiListMeta; message: string }> {
  const token = getAccessToken()
  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.message ?? "No se pudo completar la operación", response.status)
  }

  return { data: payload.data, meta: payload.meta, message: payload.message }
}

export async function loginRequest(credentials: LoginInput) {
  const result = await apiRequest<{ accessToken: string; user: Record<string, unknown> }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    }
  )
  const rawUser = result.data.user
  const fullName = String(rawUser.fullName ?? rawUser.email ?? "Usuario")
  const user: AuthUser = {
    id: String(rawUser._id ?? rawUser.id),
    fullName,
    email: String(rawUser.email ?? ""),
    role: rawUser.role as AuthUser["role"],
    status: rawUser.isActive === false ? "inactivo" : "activo",
    isActive: rawUser.isActive !== false,
  }
  return { accessToken: result.data.accessToken, user }
}

