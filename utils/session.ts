import { ROLE_VALUES, type SessionPayload } from "@/types/auth"

const SESSION_SEPARATOR = "|"

export function buildSessionToken(payload: SessionPayload): string {
  return [payload.userId, payload.role, payload.issuedAt.toString()].join(
    SESSION_SEPARATOR
  )
}

export function parseSessionToken(value?: string | null): SessionPayload | null {
  if (!value) {
    return null
  }

  const [userId, role, issuedAtRaw] = decodeURIComponent(value).split(
    SESSION_SEPARATOR
  )

  if (!userId || !role || !issuedAtRaw) {
    return null
  }

  const issuedAt = Number.parseInt(issuedAtRaw, 10)
  const isValidRole = ROLE_VALUES.includes(role as SessionPayload["role"])

  if (!Number.isFinite(issuedAt) || !isValidRole) {
    return null
  }

  return {
    userId,
    role: role as SessionPayload["role"],
    issuedAt,
  }
}
