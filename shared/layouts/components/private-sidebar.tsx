"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { APP_NAME } from "@/config/app"
import { getNavigationByRole } from "@/mocks/navigation"
import { SidebarItem } from "@/shared/components/ui/sidebar-item"
import { NAV_ICON_MAP } from "@/shared/layouts/components/navigation-icons"
import { normalizePath } from "@/routes/app-routes"
import type { Role } from "@/types/auth"

interface PrivateSidebarProps {
  role: Role
  onNavigate?: () => void
}

export function PrivateSidebar({ role, onNavigate }: PrivateSidebarProps) {
  const pathname = usePathname()
  const navigationItems = getNavigationByRole(role)
  const activePath = normalizePath(pathname)

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar px-3 py-4">
      <div className="mb-4 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/80">
          YAMEZA S.A.C.
        </p>
        <p className="mt-1 font-heading text-lg font-semibold leading-tight">{APP_NAME}</p>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Navegación principal">
        {navigationItems.map((item) => {
          const Icon = NAV_ICON_MAP[item.icon]
          const isActive = activePath === item.href

          return (
            <SidebarItem
              key={item.id}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={Icon}
              isActive={isActive}
              onNavigate={onNavigate}
            />
          )
        })}
      </nav>

      <div className="mt-4 rounded-xl border border-border bg-card px-3 py-2.5 text-xs text-muted-foreground">
        <p>Fase 1: Base frontend</p>
        <p className="mt-1">Listo para integración con backend TypeScript</p>
        <Link href="/dashboard" className="mt-2 inline-block text-primary underline-offset-2 hover:underline">
          Volver al dashboard
        </Link>
      </div>
    </aside>
  )
}
