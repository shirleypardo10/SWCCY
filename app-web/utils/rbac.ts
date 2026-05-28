import { ROLE_PERMISSIONS, type Permission } from "@/constants/permissions"
import type { Role } from "@/types/auth"

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function hasRoleAccess(role: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(role)
}

export function canAccessRoles(role: Role | null, allowedRoles: Role[]): boolean {
  if (!role) {
    return false
  }

  return hasRoleAccess(role, allowedRoles)
}
