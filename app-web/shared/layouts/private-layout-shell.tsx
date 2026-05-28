"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { AuthGuard } from "@/guards/auth-guard"
import { RoleGuard } from "@/guards/role-guard"
import { useAuth } from "@/hooks/use-auth"
import { getAllowedRolesForPath } from "@/routes/app-routes"
import { PrivateSidebar } from "@/shared/layouts/components/private-sidebar"
import { PrivateTopbar } from "@/shared/layouts/components/private-topbar"

export function PrivateLayoutShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const allowedRoles = useMemo(() => getAllowedRolesForPath(pathname), [pathname])

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true)
  }

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={allowedRoles}>
        {user ? (
          <div className="flex min-h-screen bg-background">
            <div className="hidden w-80 md:block">
              <PrivateSidebar role={user.role} />
            </div>

            {isMobileSidebarOpen ? (
              <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
                <button
                  className="absolute inset-0 bg-black/35"
                  aria-label="Cerrar menú"
                  onClick={closeMobileSidebar}
                />
                <div className="relative h-full w-80 max-w-[85vw] bg-sidebar">
                  <PrivateSidebar role={user.role} onNavigate={closeMobileSidebar} />
                </div>
              </div>
            ) : null}

            <div className="flex min-w-0 flex-1 flex-col">
              <PrivateTopbar
                pathname={pathname}
                user={user}
                onOpenMenu={openMobileSidebar}
                onLogout={handleLogout}
              />
              <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
            </div>
          </div>
        ) : null}
      </RoleGuard>
    </AuthGuard>
  )
}
