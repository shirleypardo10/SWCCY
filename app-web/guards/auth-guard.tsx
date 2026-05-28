"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"
import { APP_ROUTES } from "@/routes/app-routes"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return
    }

    const redirectQuery = pathname ? `?redirect=${encodeURIComponent(pathname)}` : ""
    router.replace(`${APP_ROUTES.login}${redirectQuery}`)
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">Validando sesión...</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cargando entorno de trabajo comercial.
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}
