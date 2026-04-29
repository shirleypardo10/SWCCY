"use client"

import { LogOut, Menu } from "lucide-react"

import { ROLE_LABELS } from "@/constants/roles"
import { Button } from "@/shared/components/ui/button"
import { getRouteMeta } from "@/routes/app-routes"
import type { AuthUser } from "@/types/auth"

interface PrivateTopbarProps {
  pathname: string
  user: AuthUser
  onOpenMenu: () => void
  onLogout: () => void
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.at(0) ?? ""}${lastName.at(0) ?? ""}`.toUpperCase()
}

export function PrivateTopbar({
  pathname,
  user,
  onOpenMenu,
  onLogout,
}: PrivateTopbarProps) {
  const routeMeta = getRouteMeta(pathname)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={onOpenMenu}
          aria-label="Abrir menú lateral"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Panel comercial</p>
          <p className="font-heading text-base font-semibold text-foreground sm:text-lg">
            {routeMeta?.label ?? "Sistema YAMEZA"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
        </div>

        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {getInitials(user.firstName, user.lastName)}
        </span>

        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="mr-1.5 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </header>
  )
}
