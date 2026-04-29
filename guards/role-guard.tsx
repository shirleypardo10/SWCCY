"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"
import { APP_ROUTES } from "@/routes/app-routes"
import { hasRoleAccess } from "@/utils/rbac"
import type { Role } from "@/types/auth"

interface RoleGuardProps {
  allowedRoles: Role[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuth()
  const router = useRouter()

  const hasAccess = user ? hasRoleAccess(user.role, allowedRoles) : false

  useEffect(() => {
    if (!user) {
      return
    }

    if (!hasAccess) {
      router.replace(APP_ROUTES.forbidden)
    }
  }, [hasAccess, router, user])

  if (!user) {
    return null
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">Validando permisos...</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Redirigiendo a una ruta permitida para tu perfil.
          </p>
        </div>
      </div>
    )
  }

  return children
}
